import React from 'react';
import './Results.css';

const ResultsScreen = ({ questions, answers, score, resetQuiz, returnToDashboard}) => {
  // Calculate number of attempted questions
  const attemptedQuestions = answers.filter(answer => answer !== null && answer !== undefined).length;
  
  // Calculate accuracy based on attempted questions
  const accuracy = attemptedQuestions > 0 
    ? Math.round((score / attemptedQuestions) * 100) 
    : 0;

  return (
    <div className="results-container">
      <h1 className="results-title">Quiz Results</h1>
      
      <div className="results-summary">
        <div className="results-summary-grid">
          <div className="results-summary-item">
            <h3 className="results-summary-label">Score</h3>
            <p className="results-summary-value">{score} / {questions.length}</p>
          </div>
          <div className="results-summary-item">
            <h3 className="results-summary-label">Accuracy</h3>
            <p className="results-summary-value">
              <span className="results-summary-percentage">
                {accuracy}%
              </span>
            </p>
          </div>
        </div>
        <div className="results-attempt-info">
          <span className="results-attempt-label">Attempted:</span>
          <span className="results-attempt-value">{attemptedQuestions} of {questions.length}</span>
        </div>
      </div>
      
      <div>
        <h2 className="results-review-title">Question Review</h2>
        <div className="results-questions">
          {questions.map((q, qIndex) => {
            const userAnswer = answers[qIndex];
            const correctAnswerIndex = typeof q.correctAnswer === 'number'
              ? q.correctAnswer
              : q.options.findIndex(opt => opt === q.correctAnswer);
              
            const isCorrect = userAnswer === correctAnswerIndex;
            const isUnattempted = userAnswer === null || userAnswer === undefined;
              
            return (
              <div key={qIndex} className="results-question">
                <p className="results-question-text">
                  {qIndex + 1}. {q.question}
                </p>
                <div className="results-options">
                  {q.options.map((option, oIndex) => {
                    let optionClass = 'results-option-neutral';
                    
                    if (oIndex === correctAnswerIndex) {
                      optionClass = 'results-option-correct';
                    } else if (oIndex === userAnswer && oIndex !== correctAnswerIndex) {
                      optionClass = 'results-option-incorrect';
                    } else if (isUnattempted && oIndex === correctAnswerIndex) {
                      optionClass = 'results-option-correct-unattempted';
                    }
                    
                    return (
                      <div
                        key={oIndex}
                        className={`results-option ${optionClass}`}
                      >
                        {option}
                        {oIndex === correctAnswerIndex && ' ✓'}
                      </div>
                    );
                  })}
                </div>
                <p className={`results-status ${
                  isUnattempted 
                    ? 'results-status-unattempted' 
                    : isCorrect 
                      ? 'results-status-correct' 
                      : 'results-status-incorrect'
                }`}>
                  {isUnattempted 
                    ? '⚠️ Unattempted' 
                    : isCorrect 
                      ? '✅ Correct' 
                      : '❌ Incorrect'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="results-buttons-container">
        <button 
          onClick={resetQuiz}
          className="results-button"
        >
          Start New Quiz
        </button>
        
        <button 
          onClick={returnToDashboard}
          className="results-button results-button-return"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;