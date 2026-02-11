import React from 'react';
import './Switch.css';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  id,
}: SwitchProps) {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="switch-container">
      {label && (
        <label htmlFor={switchId} className="switch-label">
          {label}
        </label>
      )}
      <button
        id={switchId}
        role="switch"
        aria-checked={checked}
        className={`switch ${checked ? 'switch--checked' : ''} ${disabled ? 'switch--disabled' : ''}`}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
      >
        <span className="switch__thumb" />
      </button>
    </div>
  );
}
