import React, { forwardRef } from 'react';
import { X } from 'lucide-react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showClearButton?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, showClearButton, onClear, className = '', ...props }, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasValue = props.value && String(props.value).length > 0;

    return (
      <div className={`input-wrapper ${error ? 'input-wrapper--error' : ''}`}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div className="input-container">
          <input
            ref={ref}
            id={inputId}
            className={`input ${className}`}
            {...props}
          />
          {showClearButton && hasValue && (
            <button
              type="button"
              className="input-clear"
              onClick={onClear}
              aria-label="Clear input"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {error && <span className="input-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const inputId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`input-wrapper ${error ? 'input-wrapper--error' : ''}`}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`input input--textarea ${className}`}
          {...props}
        />
        {error && <span className="input-error">{error}</span>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
