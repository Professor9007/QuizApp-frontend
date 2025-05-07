import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import axios from 'axios';
import './Auth.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name || !email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      
      const response = await axios.post('https://quizapp-backend-bqes.onrender.com/users/register', {
        name,
        email,
        password,
        role
      });

      if (response.data) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container register-page">
      {/* Spline container will be hidden on mobile via CSS */}
      <div className="auth-spline-container">
        <Spline scene="https://prod.spline.design/nRuRs7tZryTIyP0a/scene.splinecode" />
      </div>
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <h1>Join TESTIFY</h1>
          <h2>Create Your Account</h2>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Create a password"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select 
                id="role" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="role-select"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
          
          <div className="auth-redirect">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}