import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import './Sheet.css';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCloseButton?: boolean;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus trap
      sheetRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="sheet-overlay" onClick={onClose}>
      <div
        ref={sheetRef}
        className={`sheet sheet--${size}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'sheet-title' : undefined}
        tabIndex={-1}
      >
        <div className="sheet__grabber" />
        
        {(title || showCloseButton) && (
          <div className="sheet__header">
            {title && (
              <h2 id="sheet-title" className="sheet__title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                className="sheet__close"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        <div className="sheet__content">{children}</div>
      </div>
    </div>,
    document.body
  );
}
