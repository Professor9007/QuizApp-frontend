import React from 'react';
import './StatCard.css';

// Stat Card Component
export function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-content">
        <div className="icon-container">
          {icon}
        </div>
        <div className="stat-info">
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
        </div>
      </div>
    </div>
  );
}