import React, { useEffect, useState, useCallback } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHabitStore } from '../stores/habitStore';
import { HabitForm, HabitFormData, DraggableHabitList } from '../components/habits';
import { ProgressRing } from '../components/analytics';
import { Button, Sheet } from '../components/ui';
import { HabitWithCompletion } from '../types/habit';
import { formatDisplayDate, getTodayKey, formatDateKey, addDays, subDays, parseDateKey } from '../utils/dateUtils';
import './TodayPage.css';

export function TodayPage() {
  const { 
    habits, 
    selectedDate, 
    setSelectedDate, 
    toggleCompletion, 
    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    getHabitsWithCompletions,
    fetchCompletionsForDate,
  } = useHabitStore();

  const [habitsWithCompletions, setHabitsWithCompletions] = useState<HabitWithCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitWithCompletion | null>(null);

  const loadHabits = useCallback(async () => {
    setIsLoading(true);
    const data = await getHabitsWithCompletions(selectedDate);
    setHabitsWithCompletions(data);
    setIsLoading(false);
  }, [selectedDate, getHabitsWithCompletions]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits, habits]);

  useEffect(() => {
    fetchCompletionsForDate(selectedDate);
  }, [selectedDate, fetchCompletionsForDate]);

  const handleToggle = async (habitId: string) => {
    await toggleCompletion(habitId, selectedDate);
    loadHabits();
  };

  const handleAddHabit = async (data: HabitFormData) => {
    await addHabit({
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      frequency: data.frequency,
      targetDays: data.targetDays,
      targetCount: data.targetCount,
    });
    setShowAddSheet(false);
  };

  const handleEditHabit = async (data: HabitFormData) => {
    if (!editingHabit) return;
    await updateHabit(editingHabit.id, {
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      frequency: data.frequency,
      targetDays: data.targetDays,
      targetCount: data.targetCount,
    });
    setEditingHabit(null);
    loadHabits();
  };

  const handleDeleteHabit = async () => {
    if (!editingHabit) return;
    await deleteHabit(editingHabit.id);
    setEditingHabit(null);
  };

  const handleReorder = async (reorderedHabits: HabitWithCompletion[]) => {
    // Update local state immediately for smooth UX
    setHabitsWithCompletions(reorderedHabits);
    // Persist to database
    await reorderHabits(reorderedHabits.map(h => h.id));
  };

  const goToPreviousDay = () => {
    setSelectedDate(formatDateKey(subDays(parseDateKey(selectedDate), 1)));
  };

  const goToNextDay = () => {
    const nextDate = formatDateKey(addDays(parseDateKey(selectedDate), 1));
    if (nextDate <= getTodayKey()) {
      setSelectedDate(nextDate);
    }
  };

  const goToToday = () => {
    setSelectedDate(getTodayKey());
  };

  // Calculate progress
  const totalHabits = habitsWithCompletions.length;
  const completedHabits = habitsWithCompletions.filter(
    h => (h.completion?.count || 0) >= h.targetCount
  ).length;
  const progressPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

  const isToday = selectedDate === getTodayKey();

  return (
    <div className="page today-page">
      {/* Header */}
      <header className="today-page__header">
        <div className="today-page__date-nav">
          <button 
            className="today-page__nav-btn"
            onClick={goToPreviousDay}
            aria-label="Previous day"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            className="today-page__date"
            onClick={goToToday}
            disabled={isToday}
          >
            <h1 className="today-page__title">
              {formatDisplayDate(selectedDate)}
            </h1>
            {!isToday && (
              <span className="today-page__today-hint">Tap to go to today</span>
            )}
          </button>
          
          <button 
            className="today-page__nav-btn"
            onClick={goToNextDay}
            disabled={isToday}
            aria-label="Next day"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </header>

      {/* Progress */}
      {totalHabits > 0 && (
        <section className="today-page__progress">
          <ProgressRing
            progress={progressPercentage}
            size={100}
            strokeWidth={8}
            color={progressPercentage >= 100 ? 'green' : 'blue'}
            value={`${completedHabits}/${totalHabits}`}
            label="completed"
          />
          
          <div className="today-page__progress-text">
            {progressPercentage >= 100 ? (
              <>
                <span className="today-page__progress-title">🎉 All done!</span>
                <span className="today-page__progress-subtitle">
                  Great job completing all your habits
                </span>
              </>
            ) : progressPercentage > 0 ? (
              <>
                <span className="today-page__progress-title">Keep going!</span>
                <span className="today-page__progress-subtitle">
                  {totalHabits - completedHabits} more to go
                </span>
              </>
            ) : (
              <>
                <span className="today-page__progress-title">Let's start!</span>
                <span className="today-page__progress-subtitle">
                  {totalHabits} habits waiting for you
                </span>
              </>
            )}
          </div>
        </section>
      )}

      {/* Habits List */}
      <section className="today-page__habits">
        {isLoading ? (
          <div className="today-page__loading">
            <div className="today-page__skeleton" />
            <div className="today-page__skeleton" />
            <div className="today-page__skeleton" />
          </div>
        ) : habitsWithCompletions.length > 0 ? (
          <DraggableHabitList
            habits={habitsWithCompletions}
            onReorder={handleReorder}
            onToggle={handleToggle}
            onEdit={setEditingHabit}
          />
        ) : (
          <div className="today-page__empty">
            <span className="today-page__empty-icon">🌱</span>
            <h2 className="today-page__empty-title">No habits yet</h2>
            <p className="today-page__empty-text">
              Start building better habits by adding your first one
            </p>
            <Button 
              icon={Plus}
              onClick={() => setShowAddSheet(true)}
            >
              Add Your First Habit
            </Button>
          </div>
        )}
      </section>

      {/* Floating Add Button */}
      {habitsWithCompletions.length > 0 && (
        <button 
          className="today-page__fab"
          onClick={() => setShowAddSheet(true)}
          aria-label="Add new habit"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Add Habit Sheet */}
      <Sheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        title="New Habit"
        size="lg"
      >
        <HabitForm
          onSubmit={handleAddHabit}
          onCancel={() => setShowAddSheet(false)}
        />
      </Sheet>

      {/* Edit Habit Sheet */}
      <Sheet
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        title="Edit Habit"
        size="lg"
      >
        {editingHabit && (
          <HabitForm
            habit={editingHabit}
            onSubmit={handleEditHabit}
            onDelete={handleDeleteHabit}
            onCancel={() => setEditingHabit(null)}
          />
        )}
      </Sheet>
    </div>
  );
}
