import React from 'react';
import './ProgressRing.css';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  value?: string | number;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 10,
  color = 'blue',
  label,
  value,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg
        className="progress-ring__svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          className="progress-ring__bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          className={`progress-ring__progress progress-ring__progress--${color}`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      
      <div className="progress-ring__content">
        {value !== undefined && (
          <span className="progress-ring__value">{value}</span>
        )}
        {label && (
          <span className="progress-ring__label">{label}</span>
        )}
      </div>
    </div>
  );
}
