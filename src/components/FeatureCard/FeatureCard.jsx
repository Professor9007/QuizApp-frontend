import React from 'react';
import './FeatureCard.css';

// Feature Card Component
export function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="icon-container">
        {icon}
      </div>
      <h4 className="feature-title">{title}</h4>
      <p className="feature-description">{description}</p>
    </div>
  );
}