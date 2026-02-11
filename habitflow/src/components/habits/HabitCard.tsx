import React from 'react';
import { Flame, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { HabitWithCompletion } from '../../types/habit';
import { HabitCheckbox } from './HabitCheckbox';
import './HabitCard.css';

interface HabitCardProps {
  habit: HabitWithCompletion;
  onToggle: () => void;
  onEdit?: () => void;
}

export function HabitCard({ habit, onToggle, onEdit }: HabitCardProps) {
  const { 
    name, 
    icon, 
    color, 
    targetCount, 
    completion, 
    currentStreak 
  } = habit;
  
  const count = completion?.count || 0;
  const isCompleted = count >= targetCount;

  // Dynamically get icon component
  const IconComponent = (Icons as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[icon] || Icons.Circle;

  return (
    <div className={`habit-card ${isCompleted ? 'habit-card--completed' : ''}`}>
      <button 
        className="habit-card__main"
        onClick={onEdit}
        aria-label={`Edit ${name}`}
      >
        <div className={`habit-card__icon habit-card__icon--${color}`}>
          <IconComponent size={20} />
        </div>
        
        <div className="habit-card__content">
          <h3 className="habit-card__name">{name}</h3>
          
          <div className="habit-card__meta">
            {currentStreak > 0 && (
              <span className="habit-card__streak">
                <Flame size={14} className="habit-card__streak-icon" />
                {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
              </span>
            )}
            
            {targetCount > 1 && (
              <span className="habit-card__progress-text">
                {count}/{targetCount}
              </span>
            )}
          </div>
        </div>
        
        <ChevronRight size={20} className="habit-card__chevron" />
      </button>
      
      <div className="habit-card__checkbox">
        <HabitCheckbox
          completed={isCompleted}
          color={color}
          count={count}
          targetCount={targetCount}
          onToggle={onToggle}
        />
      </div>
    </div>
  );
}
