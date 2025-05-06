import React from 'react';
import { useState } from 'react';
import { FileQuestion, BarChart2, MessageSquare, Upload, ChevronRight } from 'lucide-react';
import { StatCard } from '../../components/StatCard/StatCard';
import { FeatureCard } from '../../components/FeatureCard/FeatureCard';
import './Dashboard.css';

// Dashboard Component
export default function Dashboard({ userData, onStartQuiz, onQuizDetails }) {
  const [showAll, setShowAll] = useState(false);
  const displayedQuizzes = showAll ? userData.recentQuizzes : userData.recentQuizzes.slice(0, 3);
  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div>
            <h2 className="welcome-title">Welcome back, {userData.name}!</h2>
            <p className="welcome-subtitle">Ready to test your knowledge today?</p>
          </div>
          <button 
            onClick={onStartQuiz}
            className="create-quiz-button"
          >
            Create New Quiz
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard title="Total Quizzes" value={userData.totalQuizzes} icon={<FileQuestion size={24} />} />
        <StatCard title="Average Score" value={userData.averageScore} icon={<BarChart2 size={24} />} />
        <StatCard title="Study Time" value={userData.studyTime} icon={<MessageSquare size={24} />} />
      </div>

      {/* Recent Quizzes */}
      <div className="recent-quizzes-section">
        <h3 className="section-title">Recent Quizzes</h3>
        <div className="quizzes-list">
          {displayedQuizzes.length > 0 ? (
            displayedQuizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-item">
                <div>
                  <h4 className="quiz-title">{quiz.title}</h4>
                  <p className="quiz-date">{quiz.date}</p>
                </div>
                <div className="quiz-score-container">
                  <span
                    className={`quiz-score ${
                      parseInt(quiz.score) >= 80
                        ? "score-high"
                        : parseInt(quiz.score) >= 60
                        ? "score-medium"
                        : "score-low"
                    }`}
                  >
                    {quiz.score}
                  </span>
                  <button
                    className="view-quiz-button"
                    onClick={() => onQuizDetails(quiz.id)}
                  >
                    View Quiz
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-quizzes-message">No quizzes given yet</p>
          )}
        </div>
        {userData.recentQuizzes.length > 3 && displayedQuizzes.length > 0 && (
          <button
            className="view-all-button"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : "View all quizzes"}
          </button>
        )}
      </div>


      {/* About TESTIFY */}
      <div className="about-section">
        <h3 className="section-title">About TESTIFY</h3>
        <p className="about-description">
          TESTIFY helps you master any subject through customized quizzes. Upload your study materials, 
          generate quizzes, track your progress, and get AI assistance whenever you need it.
        </p>
        <div className="features-grid">
          <FeatureCard 
            icon={<Upload size={20} />}
            title="Upload & Generate" 
            description="Upload your notes or textbooks and instantly generate quizzes"
          />
          <FeatureCard 
            icon={<BarChart2 size={20} />}
            title="Track Progress" 
            description="Monitor your performance and see your improvement over time"
          />
          <FeatureCard 
            icon={<MessageSquare size={20} />}
            title="AI Assistance" 
            description="Get help with difficult questions from our AI assistant"
          />
        </div>
      </div>
    </div>
  );
}