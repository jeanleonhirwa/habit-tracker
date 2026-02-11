import React from 'react';
import { GripVertical } from 'lucide-react';
import { HabitWithCompletion } from '../../types/habit';
import { HabitCard } from './HabitCard';
import { useDragReorder } from '../../hooks/useDragReorder';
import './DraggableHabitList.css';

interface DraggableHabitListProps {
  habits: HabitWithCompletion[];
  onReorder: (habits: HabitWithCompletion[]) => void;
  onToggle: (habitId: string) => void;
  onEdit: (habit: HabitWithCompletion) => void;
}

export function DraggableHabitList({ 
  habits, 
  onReorder, 
  onToggle, 
  onEdit 
}: DraggableHabitListProps) {
  const { dragState, getDragHandleProps, getItemStyle } = useDragReorder({
    items: habits,
    onReorder,
    getItemId: (habit) => habit.id,
  });

  return (
    <div className={`draggable-habit-list ${dragState.isDragging ? 'draggable-habit-list--dragging' : ''}`}>
      {habits.map((habit, index) => (
        <div
          key={habit.id}
          className={`draggable-habit-item ${
            dragState.draggedIndex === index ? 'draggable-habit-item--dragging' : ''
          } ${
            dragState.targetIndex === index && dragState.draggedIndex !== index 
              ? 'draggable-habit-item--target' 
              : ''
          }`}
          style={getItemStyle(index)}
          data-drag-index={index}
        >
          <div 
            className="draggable-habit-item__handle"
            {...getDragHandleProps(index)}
            aria-label="Drag to reorder"
          >
            <GripVertical size={20} />
          </div>
          
          <div className="draggable-habit-item__content">
            <HabitCard
              habit={habit}
              onToggle={() => onToggle(habit.id)}
              onEdit={() => onEdit(habit)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
