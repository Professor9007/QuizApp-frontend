import React from 'react';
import './quizdetails.css';

// New Accuracy Ring Component
const AccuracyRing = ({ percentage }) => {
  // Calculate the arc path for the given percentage
  const getArcPath = (percentage) => {
    // Circle properties
    const radius = 40;
    const strokeWidth = 8;
    const centerX = 50;
    const centerY = 50;
    
    // Calculate the angle for the given percentage (0-100%)
    const angle = (percentage / 100) * 360;
    
    // Convert angle to radians
    const angleRad = (angle - 90) * Math.PI / 180;
    
    // Calculate the end point of the arc
    const endX = centerX + radius * Math.cos(angleRad);
    const endY = centerY + radius * Math.sin(angleRad);
    
    // Determine if the arc should be drawn as a large arc (> 180 degrees)
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    // Create the SVG arc path
    // Fix for 100% - use a full circle path
    if (percentage >= 100) {
      return `
        M ${centerX} ${centerY - radius}
        A ${radius} ${radius} 0 1 1 ${centerX - 0.01} ${centerY - radius}
      `;
    }
    
    return `
      M ${centerX} ${centerY - radius}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
    `;
  };
  
  // Determine the color based on the percentage
  const getAccuracyColor = (percentage) => {
    if (percentage >= 80) return '#2ecc71'; // Green
    if (percentage >= 30) return '#f39c12'; // Yellowish-orange
    return '#e74c3c'; // Red
  };
  
  const color = getAccuracyColor(percentage);
  
  return (
    <div className="accuracy-ring-container">
      <svg width="100" height="100" viewBox="0 0 100 100">
        {/* Background circle (empty ring) */}
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          fill="none" 
          stroke="#f0f0f0" 
          strokeWidth="8"
        />
        
        {/* Progress arc (filled portion) */}
        {percentage > 0 && (
          <path
            d={getArcPath(percentage)}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
          />
        )}
        
        {/* Center text showing percentage */}
        <text 
          x="50" 
          y="45" 
          textAnchor="middle" 
          fontSize="20" 
          fontWeight="bold" 
          fill="#333"
        >
          {percentage}%
        </text>
        
        <text 
          x="50" 
          y="65" 
          textAnchor="middle" 
          fontSize="12" 
          fill="#666"
        >
          Accuracy
        </text>
      </svg>
    </div>
  );
};

const QuizDetailsScreen = ({ quizID, userData, returnToDashboard }) => {
  // Find the quiz with matching ID
  const quiz = userData.recentQuizzes.find(quiz => quiz.id === quizID);
  
  // If quiz not found, show error message
  if (!quiz) {
    return (
      <div className="quiz-not-found">
        <h2>Quiz not found</h2>
        <p>No quiz matching ID: {quizID}</p>
        <button className="return-button" onClick={returnToDashboard}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Use elapsedTime and allocatedTime from userData, format as minutes and seconds
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "Not recorded";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    } else {
      return `${minutes}m ${remainingSeconds}s`;
    }
  };
  
  const timeTaken = formatTime(quiz.elapsedTime);
  const totalTimeAllotted = formatTime(quiz.allocatedTime);
  
  // Calculate number of correct, incorrect, and unattempted answers
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  
  quiz.questions.forEach((question, index) => {
    const userAnswer = quiz.answers[index];
    
    if (userAnswer === null || userAnswer === undefined) {
      unattemptedCount++;
    } else if (userAnswer === question.correctAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });
  
  // Calculate accuracy percentage based on attempted questions only
  const attemptedCount = quiz.questions.length - unattemptedCount;
  const accuracyPercentage = attemptedCount > 0 
    ? Math.round((correctCount / attemptedCount) * 100)
    : 0;
  
  // Calculate score: correct answers / total questions
  const score = quiz.questions.length > 0 
    ? ((correctCount / quiz.questions.length) * 100).toFixed(1) + '%'
    : '0%';
  
  // Determine accuracy color class based on percentage
  const getAccuracyColorClass = (percentage) => {
    if (percentage >= 80) return 'high-accuracy';
    if (percentage >= 30) return 'medium-accuracy';
    return 'low-accuracy';
  };

  return (
    <div className="quiz-details-container">
      {/* Quiz Header Information */}
      <div className="quiz-header">
        <h1>{quiz.title}</h1>
        <div className="quiz-meta">
          <div className="meta-item">
            <span className="meta-label">Date:</span>
            <span className="meta-value">{quiz.date}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Score:</span>
            <span className={`meta-value score-text ${getAccuracyColorClass(parseFloat(score))}`}>
              {score}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Time taken:</span>
            <span className="meta-value">{timeTaken}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Time allotted:</span>
            <span className="meta-value">{totalTimeAllotted}</span>
          </div>
        </div>
      </div>

      {/* Quiz Analysis */}
      <div className="quiz-analysis">
        <h2>Quiz Analysis</h2>
        <div className="analysis-stats">
          <div className="stat-card correct-stat">
            <span className="stat-value">{correctCount}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat-card incorrect-stat">
            <span className="stat-value">{incorrectCount}</span>
            <span className="stat-label">Incorrect</span>
          </div>
          <div className="stat-card unattempted-stat">
            <span className="stat-value">{unattemptedCount}</span>
            <span className="stat-label">Unattempted</span>
          </div>
          <div className="stat-card total-questions">
            <span className="stat-value">{quiz.questions.length}</span>
            <span className="stat-label">Total Questions</span>
          </div>
        </div>
        
        {/* New Accuracy Ring Component - Separated from the stats line */}
        <div className="accuracy-ring-wrapper">
          <div className="stat-card accuracy-stat">
            <AccuracyRing percentage={accuracyPercentage} />
          </div>
        </div>
      </div>

      {/* Questions and Answers */}
      <div className="questions-section">
        <h2>Questions</h2>
        {quiz.questions.map((questionItem, questionIndex) => {
          const userAnswer = quiz.answers[questionIndex];
          const isUnattempted = userAnswer === null || userAnswer === undefined;
          const isCorrect = !isUnattempted && userAnswer === questionItem.correctAnswer;
          
          return (
            <div key={questionIndex} className="question-card">
              <div className="question-number">Question {questionIndex + 1}</div>
              <div className="question-text">{questionItem.question}</div>
              
              <div className="options-list">
                {questionItem.options.map((option, optionIndex) => {
                  let optionClass = "option";
                  
                  // Correct answer styling
                  if (optionIndex === questionItem.correctAnswer) {
                    optionClass += " correct-answer";
                  }
                  
                  // User's selected answer styling (only if attempted)
                  if (!isUnattempted && optionIndex === userAnswer) {
                    // If user selected the wrong answer
                    if (!isCorrect) {
                      optionClass += " wrong-option";
                    } else {
                      optionClass += " correct-option";
                    }
                  }
                  
                  return (
                    <div key={optionIndex} className={optionClass}>
                      <span className="option-letter">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span className="option-text">{option}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className={`answer-result ${isUnattempted ? 'unattempted' : (isCorrect ? 'correct' : 'incorrect')}`}>
                {isUnattempted 
                  ? <span className="unattempted-text">! Unattempted. The correct answer is {String.fromCharCode(65 + questionItem.correctAnswer)}</span>
                  : (isCorrect 
                    ? <span className="correct-text">✓ Correct</span>
                    : <span className="incorrect-text">✗ Incorrect. The correct answer is {String.fromCharCode(65 + questionItem.correctAnswer)}</span>
                  )
                }
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Return to Dashboard Button */}
      <div className="return-button-container">
        <button className="return-button" onClick={returnToDashboard}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuizDetailsScreen;