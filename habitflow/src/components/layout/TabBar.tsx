import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Calendar, ListChecks, BarChart3, Settings } from 'lucide-react';
import './TabBar.css';

interface TabItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const tabs: TabItem[] = [
  { path: '/', label: 'Today', icon: Calendar },
  { path: '/habits', label: 'Habits', icon: ListChecks },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function TabBar() {
  const location = useLocation();

  return (
    <nav className="tab-bar" role="navigation" aria-label="Main navigation">
      {tabs.map(({ path, label, icon: Icon }) => {
        const isActive = location.pathname === path;
        
        return (
          <NavLink
            key={path}
            to={path}
            className={`tab-bar__item ${isActive ? 'tab-bar__item--active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon 
              className="tab-bar__icon" 
              size={24} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className="tab-bar__label">{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
