import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Habit, HabitColor, FrequencyType } from '../../types/habit';
import { Button, Input, SegmentedControl } from '../ui';
import './HabitForm.css';

interface HabitFormProps {
  habit?: Habit;
  onSubmit: (data: HabitFormData) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export interface HabitFormData {
  name: string;
  description: string;
  icon: string;
  color: HabitColor;
  frequency: FrequencyType;
  targetDays: number[];
  targetCount: number;
}

const colorOptions: HabitColor[] = ['blue', 'green', 'red', 'orange', 'purple', 'pink', 'teal', 'indigo'];

const iconOptions = [
  'Heart', 'Star', 'Zap', 'Flame', 'Target', 'Trophy',
  'Book', 'Dumbbell', 'Moon', 'Sun', 'Coffee', 'Droplet',
  'Apple', 'Bike', 'Brain', 'Brush', 'Camera', 'Code',
  'Compass', 'Edit3', 'Feather', 'Gift', 'Headphones', 'Home',
  'Lightbulb', 'Music', 'Pencil', 'Phone', 'Smile', 'Users'
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function HabitForm({ habit, onSubmit, onDelete, onCancel }: HabitFormProps) {
  const [name, setName] = useState(habit?.name || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [icon, setIcon] = useState(habit?.icon || 'Star');
  const [color, setColor] = useState<HabitColor>(habit?.color || 'blue');
  const [frequency, setFrequency] = useState<FrequencyType>(habit?.frequency || 'daily');
  const [targetDays, setTargetDays] = useState<number[]>(habit?.targetDays || [0, 1, 2, 3, 4, 5, 6]);
  const [targetCount, setTargetCount] = useState(habit?.targetCount || 1);
  
  const [errors, setErrors] = useState<{ name?: string }>({});

  const isEditing = !!habit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setErrors({ name: 'Habit name is required' });
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      frequency,
      targetDays: frequency === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : targetDays,
      targetCount,
    });
  };

  const toggleDay = (day: number) => {
    if (targetDays.includes(day)) {
      if (targetDays.length > 1) {
        setTargetDays(targetDays.filter(d => d !== day));
      }
    } else {
      setTargetDays([...targetDays, day].sort());
    }
  };

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      {/* Name Input */}
      <div className="habit-form__section">
        <Input
          label="Habit Name"
          placeholder="e.g., Morning Meditation"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors({});
          }}
          error={errors.name}
          autoFocus
        />
      </div>

      {/* Description */}
      <div className="habit-form__section">
        <Input
          label="Description (optional)"
          placeholder="Why is this habit important?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Icon Selection */}
      <div className="habit-form__section">
        <label className="habit-form__label">Icon</label>
        <div className="habit-form__icons">
          {iconOptions.map((iconName) => {
            const IconComponent = (Icons as Record<string, React.ComponentType<{ size?: number }>>)[iconName];
            if (!IconComponent) return null;
            
            return (
              <button
                key={iconName}
                type="button"
                className={`habit-form__icon-btn ${icon === iconName ? 'habit-form__icon-btn--active' : ''}`}
                onClick={() => setIcon(iconName)}
                style={{ 
                  backgroundColor: icon === iconName ? `var(--color-${color})` : undefined 
                }}
              >
                <IconComponent size={20} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Selection */}
      <div className="habit-form__section">
        <label className="habit-form__label">Color</label>
        <div className="habit-form__colors">
          {colorOptions.map((c) => (
            <button
              key={c}
              type="button"
              className={`habit-form__color-btn habit-form__color-btn--${c} ${color === c ? 'habit-form__color-btn--active' : ''}`}
              onClick={() => setColor(c)}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div className="habit-form__section">
        <label className="habit-form__label">Frequency</label>
        <SegmentedControl
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Specific Days' },
          ]}
          value={frequency === 'custom' ? 'weekly' : frequency}
          onChange={(v) => setFrequency(v as FrequencyType)}
          fullWidth
        />
      </div>

      {/* Day Selection (for weekly) */}
      {frequency !== 'daily' && (
        <div className="habit-form__section">
          <label className="habit-form__label">On these days</label>
          <div className="habit-form__days">
            {dayNames.map((day, index) => (
              <button
                key={day}
                type="button"
                className={`habit-form__day-btn ${targetDays.includes(index) ? 'habit-form__day-btn--active' : ''}`}
                onClick={() => toggleDay(index)}
                style={{
                  backgroundColor: targetDays.includes(index) ? `var(--color-${color})` : undefined
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Target Count */}
      <div className="habit-form__section">
        <label className="habit-form__label">Times per day</label>
        <div className="habit-form__count">
          <button
            type="button"
            className="habit-form__count-btn"
            onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
            disabled={targetCount <= 1}
          >
            -
          </button>
          <span className="habit-form__count-value">{targetCount}</span>
          <button
            type="button"
            className="habit-form__count-btn"
            onClick={() => setTargetCount(Math.min(20, targetCount + 1))}
            disabled={targetCount >= 20}
          >
            +
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="habit-form__actions">
        <Button type="submit" fullWidth>
          {isEditing ? 'Save Changes' : 'Create Habit'}
        </Button>
        
        {isEditing && onDelete && (
          <Button 
            type="button" 
            variant="destructive" 
            fullWidth
            onClick={onDelete}
          >
            Delete Habit
          </Button>
        )}
        
        <Button 
          type="button" 
          variant="ghost" 
          fullWidth
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
