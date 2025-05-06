import React from 'react';
import './SubjectBar.css';

export function SubjectBar({ subject, percentage }) {
  // Determine color class based on percentage
  const getColorClass = () => {
    if (percentage >= 80) return 'progress-bar-high';
    if (percentage >= 60) return 'progress-bar-medium';
    return 'progress-bar-low';
  };

  return (
    <div className="subject-bar-container">
      <div className="subject-bar-header">
        <span className="subject-name">{subject}</span>
        <span className="subject-percentage">{percentage}%</span>
      </div>
      <div className="progress-bar-bg">
        <div 
          className={`progress-bar ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}