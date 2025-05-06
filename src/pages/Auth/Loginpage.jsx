import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import './Auth.css';

// Create a utility function to process quiz data
// Create a utility function to process quiz data
export const processQuizData = (quizData) => {
  const totalQuizzes = quizData.length;

  let totalCorrect = 0;
  let totalQuestions = 0;
  let totalTimeSeconds = 0;

  const recentQuizzes = quizData
    .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
    .map((quiz, index) => {
      const title = `${index + 1}${getOrdinalSuffix(index + 1)} Quiz`;

      const questions = quiz.quizElements.data.questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      }));

      const correctCount = questions.reduce((count, q, i) => {
        // Use correctAnswer as 0-based index (remove the -1)
        const correctIndex = q.correctAnswer;
        return count + (quiz.answers[i] === correctIndex ? 1 : 0);
      }, 0);

      totalCorrect += correctCount;
      totalQuestions += questions.length;
      totalTimeSeconds += quiz.elapsedTime ?? 0;

      return {
        id: quiz._id,
        title: title,
        quizScore: correctCount, // ✅ Only this field, count of correct answers
        date: new Date(quiz.registeredAt).toISOString().split('T')[0],
        questions: questions,
        answers: quiz.answers,
        allocatedTime: quiz.allocatedTime,
        elapsedTime: quiz.elapsedTime,

      };
    });

  const averageScore =
    totalQuestions > 0
      ? `${Math.round((totalCorrect / totalQuestions) * 100)}%`
      : '0%';

  const studyTimeHours = Math.floor(totalTimeSeconds / 3600);
  const studyTimeMinutes = Math.round((totalTimeSeconds % 3600) / 60);
  const studyTime =
    studyTimeHours > 0
      ? `${studyTimeHours} hours ${
          studyTimeMinutes > 0 ? `${studyTimeMinutes} minutes` : ''
        }`
      : `${studyTimeMinutes} minutes`;

  const name = quizData.length > 0 ? quizData[0].name : 'Unknown User';

  function getOrdinalSuffix(num) {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  }

  return {
    name,
    recentQuizzes,
    totalQuizzes,
    averageScore,
    studyTime,
  };
};



export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      // Validate inputs
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
  
      // Login request
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      if (!data.token) {
        throw new Error('No authentication token received');
      }
  
      // Store token
      localStorage.setItem('token', data.token);
  
      // Try to fetch quizzes
      let userData;
      const quizzesResponse = await fetch('http://localhost:3001/quizzes', {
        headers: { Authorization: `Bearer ${data.token}` }
      });
  
      if (quizzesResponse.ok) {
        const quizData = await quizzesResponse.json();
        
        // Check if quiz data is empty
        if (quizData?.length > 0) {
          userData = processQuizData(quizData);
        } else {
          // If no quiz data, fetch user profile
          console.log('No quiz data found. Fetching user profile...');
          const profileResponse = await fetch('http://localhost:3001/users/profile', {
            headers: {
              Authorization: `Bearer ${data.token}`,
              'Content-Type': 'application/json'
            }
          });
  
          if (!profileResponse.ok) {
            throw new Error('Failed to fetch user profile');
          }
  
          const profileData = await profileResponse.json();
          userData = {
            name: profileData.user?.name || 'Unknown User',
            totalQuizzes: 0,
            averageScore: "0%",
            studyTime: "0 minutes",
            recentQuizzes: []
          };
        }
      } else {
        throw new Error('Failed to fetch quiz data');
      }
  
      // Store user data
      localStorage.setItem('userData', JSON.stringify(userData));
      navigate('/dashboard');
  
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-spline-container">
        <Spline scene="https://prod.spline.design/nRuRs7tZryTIyP0a/scene.splinecode" />
      </div>
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <h1>Welcome to TESTIFY</h1>
          <h2>Login to Your Account</h2>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleLogin} className="auth-form">
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
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="auth-redirect">
            Don't have an account? <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}