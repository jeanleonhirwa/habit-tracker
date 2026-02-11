import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TrendData } from '../../types/analytics';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: TrendData;
  icon?: LucideIcon;
  color?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  color = 'blue',
}: StatCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const TrendIcon = getTrendIcon();

  return (
    <div className="stat-card">
      {Icon && (
        <div className={`stat-card__icon stat-card__icon--${color}`}>
          <Icon size={20} />
        </div>
      )}
      
      <div className="stat-card__content">
        <span className="stat-card__title">{title}</span>
        <span className="stat-card__value">{value}</span>
        
        {(subtitle || trend) && (
          <div className="stat-card__footer">
            {trend && TrendIcon && (
              <span className={`stat-card__trend stat-card__trend--${trend.direction}`}>
                <TrendIcon size={14} />
                {Math.abs(trend.percentage).toFixed(0)}%
              </span>
            )}
            {subtitle && (
              <span className="stat-card__subtitle">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
