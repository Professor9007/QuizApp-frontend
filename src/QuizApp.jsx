import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { processQuizData } from './pages/Auth/Loginpage.jsx';
import {SidebarItem} from './components/SideBarItem/SideBarItem.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import AIChat from './pages/AiChat/AiChat.jsx';
import SetupScreen from './components/setup/Setup.jsx';
import QuizScreen from './components/quiz/Quiz.jsx';
import ResultsScreen from './components/results/Results.jsx';
import parseQuestionsFromText from './utils/HelperFunctions.jsx';
import FileUploadScreen from './components/fileupload/fileupload.jsx';
import QuizDetailsScreen from './components/QuizDetails/quizdetails.jsx';
import { Home, MessageSquare, FileQuestion, Menu, X, LogOut } from 'lucide-react';

// Main App Component
import './App.css';

export default function QuizApp({logout}) {
  const [activeTab, setActiveTab] = useState('dashboard'); // setup, quiz, results, fileupload,homepage
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [initialTime, setInitialTime] = useState(60); // in seconds
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [fileError, setFileError] = useState("");
  const [questionsText, setQuestionsText] = useState("");
  const timerRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userData, setUserData] = useState(() => {
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : null;
  });
  
  const [quizID, setQuizID] = useState(null);



  const updateUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
  
      // Fetch quiz data
      const profileResponse = await fetch('https://quizapp-backend-bqes.onrender.com/quizzes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }
  
      const quizData = await profileResponse.json();
      const userData = processQuizData(quizData); // fully processed userData
  
      localStorage.setItem('userData', JSON.stringify(userData));
      setUserData(userData); // Update state with new user data
  
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
  

  const handleQuizDetails = (quizId) => {
    setQuizID(quizId);
    setActiveTab('quizDetails');
    setIsMobileMenuOpen(false);
  };
  
  
  const handleStartQuiz = () => {
    setActiveTab('fileupload');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleQuestionsInput = (input) => {
    setQuestionsText(input);
    setActiveTab('setup');
    
    try {
      const parsedQuestions = parseQuestionsFromText(input);
      
      if (parsedQuestions.length === 0 && input.trim() !== "") {
        setFileError("No valid questions found. Please check the format.");
        return;
      }
      
      setFileError("");
      setQuestions(parsedQuestions);
      setNumQuestions(Math.min(5, parsedQuestions.length)); // Default to 5 or max available
    } catch (error) {
      setFileError("Error parsing questions. Please check the format.");
    }
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const startQuiz = () => {
    if (questions.length === 0) {
      setFileError("Please wait for a few seconds for the questions to load.");
      return;
    }
    
    // Keep a copy of the original questions
    const allQuestions = [...questions];
    
    // Select the requested number of questions
    const questionsToUse = allQuestions.slice(0, numQuestions);
    
    // Create answers array without changing the main questions state
    setAnswers(new Array(questionsToUse.length).fill(null));
    setCurrentQuestion(0);
    setTimer(initialTime*numQuestions);
    setScore(0);
    setSelectedOption(null);
    setActiveTab('quiz');
    
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          // Time is up
          clearInterval(timerRef.current);
          setActiveTab('results');
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const moveToNextQuestion = () => {
    // Create a variable to hold the updated answers
    let updatedAnswers = [...answers];
    
    // Save the answer
    if (selectedOption !== null) {
      updatedAnswers[currentQuestion] = selectedOption;
      setAnswers(updatedAnswers);  // Update state (asynchronous)
      
      // Check if correct and update score
      const questionsToUse = questions.slice(0, numQuestions);
      const currentQ = questionsToUse[currentQuestion];
      const correctAnswerIndex = typeof currentQ.correctAnswer === 'number' 
        ? currentQ.correctAnswer 
        : currentQ.options.findIndex(opt => opt === currentQ.correctAnswer);
        
      if (selectedOption === correctAnswerIndex) {
        setScore(prevScore => prevScore + 1);
      }
    }
  
    // Move to next question or finish
    if (currentQuestion < numQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      // End of quiz
      clearInterval(timerRef.current);
      
      // Pass the updated answers directly to quizElementsData instead of relying on state
      quizElementsDataWithUpdatedAnswers(updatedAnswers);
      
      setActiveTab('results');
    }
  };
  
  // New function that accepts the updated answers
  const quizElementsDataWithUpdatedAnswers = (updatedAnswers) => {
    // This function will be called when the quiz ends
    const allocatedTime = initialTime * numQuestions;
    const elapsedTime = allocatedTime - timer;
  
    const quizElements = {
      questions: questions.slice(0, numQuestions),
      answers: updatedAnswers,  // Use the updated answers passed as an argument
      allocatedTime: allocatedTime,
      elapsedTime: elapsedTime,
      date: new Date().toISOString(),
    };
    console.log(quizElements);
  
    // API call remains the same
    const token = localStorage.getItem('token');
    
    fetch('https://quizapp-backend-bqes.onrender.com/quizzes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(quizElements),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save quiz data');
      }
      return response.json();
    })
    .then(data => {
      // console.log('Quiz saved successfully:', data);
      return updateUserData(); // ✅ return promise
    })
    .then(() => {
      // console.log('UserData updated!');
    })
    .catch(error => {
      console.error('Error saving quiz:', error);
    });
  };

  const resetQuiz = () => {
    clearInterval(timerRef.current);
    setActiveTab('setup');
    setSelectedOption(null);
  };
  const returnToDashboard = () => {
    setActiveTab('dashboard');
    setIsMobileMenuOpen(false);
  }
  return (
    <div className="app-container">
      <div className="sidebar-background" id='flexbox-adjusting2'>
      {/* Mobile menu button */}
      <div className="mobile-menu-button">
        <button onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1>TESTIFY</h1>
        </div>
        
        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <div className="nav-items">
            <SidebarItem 
              icon={<Home size={20} />} 
              title="Dashboard" 
              active={['dashboard', 'quizDetails'].includes(activeTab)} 
              onClick={() => {setActiveTab('dashboard'); setIsMobileMenuOpen(false);}} 
            />
            <SidebarItem 
              icon={<FileQuestion size={20} />} 
              title="Quizzes" 
              active={['setup', 'quiz', 'results', 'fileupload'].includes(activeTab)} 
              onClick={() => {setActiveTab('fileupload'); setIsMobileMenuOpen(false);}} 
            />
            <SidebarItem 
              icon={<MessageSquare size={20} />} 
              title="AI Chat" 
              active={activeTab === 'ai-chat'} 
              onClick={() => {setActiveTab('ai-chat'); setIsMobileMenuOpen(false);}} 
            />
          </div>
        </nav>
        
        {/* User Profile */}
        <div className="sidebar-user">
          <div className="user-profile">
            <div className="user-avatar">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="user-info">
              <p className="user-name">{userData.name}</p>
              <p className="user-role">Student</p>
            </div>
          </div>
          
          {/* Logout Button */}
          <div className="logout-container">
            <button className="logout-button" onClick={() => setShowLogoutConfirm(true)}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="logout-overlay">
          <div className="logout-dialog">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="logout-actions">
              <button className="cancel-button" onClick={() => setShowLogoutConfirm(false)}>
                No, Cancel
              </button>
              <button className="confirm-button" onClick={logout}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="main-content" id='flexbox-adjusting'>
        {/* Main content header */}
        <header className="main-header">
          <div className="header-container">
            <h1 className="header-title">
              {activeTab === 'dashboard' && "Dashboard"}
              {activeTab === 'fileupload' && "Create Quiz"}
              {activeTab === 'setup' && "Quiz Setup"}
              {activeTab === 'quiz' && "Quiz in Progress"}
              {activeTab === 'results' && "Quiz Results"}
              {activeTab === 'ai-chat' && "AI Assistant"}
              {activeTab === 'quizDetails' && "Quiz Details"}
            </h1>
          </div>
        </header>

        <main className="main-body">
          {activeTab === 'dashboard' && <Dashboard userData={userData} 
          onStartQuiz={handleStartQuiz} 
          onQuizDetails={handleQuizDetails} 
          />}
          {activeTab === 'ai-chat' && <AIChat />}
          {activeTab === 'fileupload' && (
            <div className="fileupload-container">
              <FileUploadScreen
                handleQuestionsInput={handleQuestionsInput}
              />
            </div>
          )}
          {activeTab === 'setup' && (
            <div className="setup-container">
              <SetupScreen 
                questionsText={questionsText}
                handleQuestionsInput={handleQuestionsInput}
                fileError={fileError}
                numQuestions={numQuestions}
                setNumQuestions={setNumQuestions}
                questions={questions}
                initialTime={initialTime}
                setInitialTime={setInitialTime}
                startQuiz={startQuiz}
              />
            </div>
          )}

          {activeTab === 'quiz' && questions.length > 0 && (
            <div className="quiz-container">
              <QuizScreen 
                questions={questions.slice(0, numQuestions)}
                currentQuestion={currentQuestion}
                timer={timer}
                selectedOption={selectedOption}
                handleOptionSelect={handleOptionSelect}
                moveToNextQuestion={moveToNextQuestion}
              />
            </div>
          )}

          {activeTab === 'results' && (
            <div className="results-container">
              <ResultsScreen 
                questions={questions.slice(0, numQuestions)}
                answers={answers}
                score={score}
                resetQuiz={resetQuiz}
                returnToDashboard={returnToDashboard}
              />
            </div>
          )}
          {activeTab === 'quizDetails' && (
            <div className="quiz-details-container">
            <QuizDetailsScreen
              quizID={quizID}
              userData={userData}
              returnToDashboard={returnToDashboard} 
            />
            </div>
            )}
        </main>
      </div>
    </div>
  );
}