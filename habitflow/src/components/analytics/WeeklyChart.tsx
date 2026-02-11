import React from 'react';
import { WeeklyData } from '../../types/analytics';
import './WeeklyChart.css';

interface WeeklyChartProps {
  data: WeeklyData[];
  color?: string;
}

export function WeeklyChart({ data, color = 'blue' }: WeeklyChartProps) {
  const maxValue = Math.max(...data.map(d => d.target), 1);

  return (
    <div className="weekly-chart">
      <div className="weekly-chart__bars">
        {data.map((day) => {
          const completedHeight = (day.completed / maxValue) * 100;
          const targetHeight = (day.target / maxValue) * 100;
          const percentage = day.target > 0 ? (day.completed / day.target) * 100 : 0;

          return (
            <div 
              key={day.date} 
              className={`weekly-chart__bar-container ${day.isToday ? 'weekly-chart__bar-container--today' : ''}`}
            >
              <div className="weekly-chart__bar-wrapper">
                {/* Target indicator */}
                <div 
                  className="weekly-chart__target-line"
                  style={{ bottom: `${targetHeight}%` }}
                />
                
                {/* Completed bar */}
                <div 
                  className={`weekly-chart__bar weekly-chart__bar--${color}`}
                  style={{ height: `${completedHeight}%` }}
                >
                  {percentage >= 100 && (
                    <span className="weekly-chart__complete-indicator">✓</span>
                  )}
                </div>
              </div>
              
              <span className="weekly-chart__label">{day.dayShort}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
