import React, { useState, useEffect } from 'react';
import './Quiz.css';

const QuizScreen = ({ 
  questions, 
  currentQuestion, 
  timer, 
  selectedOption, 
  handleOptionSelect, 
  moveToNextQuestion 
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const handleClearSelection = () => {
    handleOptionSelect(null);
  };

  const handleSkip = () => {
    handleOptionSelect(null);
    moveToNextQuestion();
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="quiz-timer">
          <span className="quiz-timer-icon">⏱️</span>
          {formatTime(timer)}
        </div>
      </div>

      <div className="quiz-content">
        <h2 className="quiz-question">{questions[currentQuestion].question}</h2>
        <div className="quiz-options">
          {questions[currentQuestion].options.map((option, index) => (
            <div 
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`quiz-option ${selectedOption === index ? 'selected' : ''}`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>

      <div className="quiz-buttons-container">
        <button 
          className="quiz-button clear-button"
          onClick={handleClearSelection}
          disabled={selectedOption === null}
        >
          {isMobile ? 'Clear' : 'Clear Selection'}
        </button>
        <div className="quiz-button-group">
          <button 
            className="quiz-button skip-button"
            onClick={handleSkip}
            disabled={selectedOption !== null}
          >
            Skip
          </button>
          <button 
            onClick={moveToNextQuestion}
            className="quiz-button"
            disabled={selectedOption === null}
          >
            {currentQuestion < questions.length - 1 ? (isMobile ? 'Next' : 'Next Question') : 'Finish Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;