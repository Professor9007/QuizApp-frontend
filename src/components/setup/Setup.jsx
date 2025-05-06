import React from 'react';
import './Setup.css';

const SetupScreen = ({
  questionsText,
  handleQuestionsInput,
  fileError,
  numQuestions,
  setNumQuestions,
  questions,
  initialTime,
  setInitialTime,
  startQuiz
}) => {

  return (
    <div className="setup-container">
      <h1 className="setup-title">Quiz Setup</h1>
      
      <div className="setup-info">
        <p className="setup-info-text">
          Configure your quiz settings below. Questions have been automatically loaded.
        </p>
      </div>

      <div className="setup-form-group">
        <label className="setup-label">
          Number of Questions (max {questions.length || 0})
        </label>
        <input
          type="number"
          min="5"
          max={questions.length || 10}
          value={numQuestions}
          onChange={(e) => setNumQuestions(Math.min(questions.length || 10, Math.max(1, parseInt(e.target.value) || 1)))}
          className="setup-input"
        />
      </div>

      <div className="setup-form-group">
        <label className="setup-label">
          Time per Question (seconds)
        </label>
        <input
          type="number"
          min="5"
          max="300"
          value={initialTime}
          onChange={(e) => setInitialTime(Math.max(5, parseInt(e.target.value) || 60))}
          className="setup-input"
        />
      </div>

      {fileError && <p className="setup-error">{fileError}</p>}

      <button
        onClick={startQuiz}
        className="setup-button"
      >
        Start Quiz
      </button>
    </div>
  );
};

export default SetupScreen;