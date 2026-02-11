import React from 'react';
import { HeatmapCell } from '../../types/analytics';
import { parseDateKey, format } from '../../utils/dateUtils';
import './Heatmap.css';

interface HeatmapProps {
  data: HeatmapCell[];
  color?: string;
  onCellClick?: (date: string) => void;
}

export function Heatmap({ data, color = 'green', onCellClick }: HeatmapProps) {
  // Group data by week
  const weeks: HeatmapCell[][] = [];
  let currentWeek: HeatmapCell[] = [];

  // Pad the first week if needed
  if (data.length > 0) {
    const firstDate = parseDateKey(data[0].date);
    const dayOfWeek = firstDate.getDay();
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push({ date: '', count: 0, intensity: 0 });
    }
  }

  data.forEach((cell, index) => {
    currentWeek.push(cell);
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Add remaining days
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="heatmap">
      <div className="heatmap__container">
        {/* Day labels */}
        <div className="heatmap__day-labels">
          {dayLabels.map((day, i) => (
            <span key={i} className="heatmap__day-label">{i % 2 === 1 ? day : ''}</span>
          ))}
        </div>

        {/* Grid */}
        <div className="heatmap__grid">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="heatmap__week">
              {week.map((cell, dayIndex) => (
                <button
                  key={`${weekIndex}-${dayIndex}`}
                  className={`heatmap__cell heatmap__cell--${color} heatmap__cell--intensity-${cell.intensity}`}
                  onClick={() => cell.date && onCellClick?.(cell.date)}
                  disabled={!cell.date}
                  title={cell.date ? `${format(parseDateKey(cell.date), 'MMM d, yyyy')}: ${cell.count} completions` : ''}
                  aria-label={cell.date ? `${format(parseDateKey(cell.date), 'MMM d')}, ${cell.count} completions` : 'No data'}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="heatmap__legend">
        <span className="heatmap__legend-label">Less</span>
        <div className="heatmap__legend-cells">
          {[0, 1, 2, 3, 4].map((intensity) => (
            <div 
              key={intensity}
              className={`heatmap__legend-cell heatmap__cell--${color} heatmap__cell--intensity-${intensity}`}
            />
          ))}
        </div>
        <span className="heatmap__legend-label">More</span>
      </div>
    </div>
  );
}
