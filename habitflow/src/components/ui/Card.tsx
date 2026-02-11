import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Card({
  children,
  padding = 'md',
  hoverable = false,
  onClick,
  className = '',
}: CardProps) {
  const classes = [
    'card',
    `card--padding-${padding}`,
    hoverable && 'card--hoverable',
    onClick && 'card--clickable',
    className,
  ].filter(Boolean).join(' ');

  const Component = onClick ? 'button' : 'div';

  return (
    <Component className={classes} onClick={onClick}>
      {children}
    </Component>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`card__header ${className}`}>
      <div className="card__header-text">
        <h3 className="card__title">{title}</h3>
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="card__header-action">{action}</div>}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`card__content ${className}`}>{children}</div>;
}

interface CardGroupProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function CardGroup({ children, title, className = '' }: CardGroupProps) {
  return (
    <div className={`card-group ${className}`}>
      {title && <h2 className="card-group__title">{title}</h2>}
      <div className="card-group__cards">{children}</div>
    </div>
  );
}
