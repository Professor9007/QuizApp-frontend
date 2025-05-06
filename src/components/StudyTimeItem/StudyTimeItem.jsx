import React from 'react';
import './StudyTimeItem.css';

// Study Time Item Component
export function StudyTimeItem({ day, hours }) {
  const progressPercentage = Math.min(hours/5 * 100, 100);
    
  return (
    <div className="study-time-item">
      <span className="day-label">{day}</span>
      <div className="hours-container">
        <div className="progress-container">
          <div 
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <span className="hours-text">{hours} hrs</span>
      </div>
    </div>
  );
}