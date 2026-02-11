import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { HabitColor } from '../../types/habit';
import './HabitCheckbox.css';

interface HabitCheckboxProps {
  completed: boolean;
  color: HabitColor;
  onToggle: () => void;
  count?: number;
  targetCount?: number;
  disabled?: boolean;
}

export function HabitCheckbox({
  completed,
  color,
  onToggle,
  count = 0,
  targetCount = 1,
  disabled = false,
}: HabitCheckboxProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isPartiallyComplete = count > 0 && count < targetCount;
  const isFullyComplete = count >= targetCount;
  const progress = targetCount > 1 ? count / targetCount : 0;

  const handleClick = () => {
    if (disabled) return;
    
    if (!isFullyComplete) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
    }
    
    onToggle();
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isFullyComplete}
      aria-label={`${isFullyComplete ? 'Completed' : 'Not completed'}${targetCount > 1 ? `, ${count} of ${targetCount}` : ''}`}
      className={`habit-checkbox habit-checkbox--${color} ${isFullyComplete ? 'habit-checkbox--completed' : ''} ${isAnimating ? 'habit-checkbox--animating' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {/* Progress ring for multi-count habits */}
      {targetCount > 1 && (
        <svg className="habit-checkbox__progress" viewBox="0 0 36 36">
          <circle
            className="habit-checkbox__progress-bg"
            cx="18"
            cy="18"
            r="16"
            fill="none"
            strokeWidth="2"
          />
          <circle
            className="habit-checkbox__progress-fill"
            cx="18"
            cy="18"
            r="16"
            fill="none"
            strokeWidth="2"
            strokeDasharray={`${progress * 100} 100`}
            transform="rotate(-90 18 18)"
          />
        </svg>
      )}
      
      {/* Checkmark or count */}
      <span className="habit-checkbox__inner">
        {isFullyComplete ? (
          <Check size={20} strokeWidth={3} />
        ) : targetCount > 1 && count > 0 ? (
          <span className="habit-checkbox__count">{count}</span>
        ) : null}
      </span>
    </button>
  );
}
