import React from 'react';
import { ChevronRight } from 'lucide-react';
import './SidebarItem.css';

// Sidebar Item Component
export function SidebarItem({ icon, title, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`sidebar-item ${active ? 'active' : ''}`}
    >
      <span className="sidebar-icon">{icon}</span>
      <span className="sidebar-title">{title}</span>
      {active && <ChevronRight size={16} className="sidebar-chevron" />}
    </button>
  );
}