import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import QuizApp from './QuizApp';
import LoginPage from './pages/Auth/Loginpage';
import RegisterPage from './pages/Auth/Registerpage';
import { jwtDecode } from 'jwt-decode'; // ✅

import './App.css';

// Logout function
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  window.location.href = '/login';
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    logout(); // Token expired
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      logout(); // Token expired
      return null;
    }
  } catch (err) {
    logout(); // Invalid token
    return null;
  }

  return children;
};

// Function to schedule token renewal
const scheduleTokenRenewal = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const expiryTime = decoded.exp; // in seconds

    const timeUntilRenewal = (expiryTime - currentTime - 240) * 1000; // renew 4 mins before expiry

    if (timeUntilRenewal <= 0) {
      // If already expired or renewal time passed
      logout();
      return;
    }


    setTimeout(async () => {
      try {
        const currentToken = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/users/renew-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Token renewal failed');
        }

        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          // Reschedule the next renewal
          scheduleTokenRenewal(data.token);
        } else {
          throw new Error('No token in renewal response');
        }
      } catch (error) {
        console.error('Error renewing token:', error);
        logout();
      }
    }, timeUntilRenewal);
  } catch (err) {
    console.error('Invalid token:', err);
    logout();
  }
};

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      scheduleTokenRenewal(token);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <QuizApp logout={logout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
