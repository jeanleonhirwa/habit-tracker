import React, { useState, useEffect } from 'react';
import { Plus, Archive, RotateCcw, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useHabitStore } from '../stores/habitStore';
import { HabitForm, HabitFormData } from '../components/habits';
import { Button, Sheet, SegmentedControl, CardGroup } from '../components/ui';
import { Habit } from '../types/habit';
import { db } from '../db/database';
import './HabitsPage.css';

type FilterType = 'active' | 'archived';

export function HabitsPage() {
  const { 
    habits, 
    addHabit, 
    updateHabit, 
    deleteHabit, 
    archiveHabit,
    restoreHabit,
    fetchHabits,
  } = useHabitStore();

  const [filter, setFilter] = useState<FilterType>('active');
  const [archivedHabits, setArchivedHabits] = useState<Habit[]>([]);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    loadArchivedHabits();
  }, []);

  const loadArchivedHabits = async () => {
    const all = await db.habits.toArray();
    setArchivedHabits(all.filter(h => h.archivedAt));
  };

  const displayHabits = filter === 'active' ? habits : archivedHabits;

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
  };

  const handleArchiveHabit = async (habitId: string) => {
    await archiveHabit(habitId);
    loadArchivedHabits();
  };

  const handleRestoreHabit = async (habitId: string) => {
    await restoreHabit(habitId);
    loadArchivedHabits();
  };

  const handleDeleteHabit = async () => {
    if (!editingHabit) return;
    await deleteHabit(editingHabit.id);
    setEditingHabit(null);
    if (filter === 'archived') {
      loadArchivedHabits();
    }
  };

  const handlePermanentDelete = async (habitId: string) => {
    if (confirm('Are you sure you want to permanently delete this habit? This cannot be undone.')) {
      await deleteHabit(habitId);
      loadArchivedHabits();
    }
  };

  return (
    <div className="page habits-page">
      {/* Header */}
      <header className="page__header">
        <h1 className="page__title">Habits</h1>
        <p className="page__subtitle">Manage your daily habits</p>
      </header>

      {/* Filter */}
      <div className="habits-page__filter">
        <SegmentedControl
          options={[
            { value: 'active', label: `Active (${habits.length})` },
            { value: 'archived', label: `Archived (${archivedHabits.length})` },
          ]}
          value={filter}
          onChange={setFilter}
          fullWidth
        />
      </div>

      {/* Habits List */}
      <section className="habits-page__list">
        {displayHabits.length > 0 ? (
          <CardGroup>
            {displayHabits.map((habit) => {
              const IconComponent = (Icons as Record<string, React.ComponentType<{ size?: number }>>)[habit.icon] || Icons.Circle;
              
              return (
                <div key={habit.id} className="habits-page__item">
                  <button 
                    className="habits-page__item-main"
                    onClick={() => setEditingHabit(habit)}
                  >
                    <div className={`habits-page__item-icon habits-page__item-icon--${habit.color}`}>
                      <IconComponent size={20} />
                    </div>
                    
                    <div className="habits-page__item-content">
                      <span className="habits-page__item-name">{habit.name}</span>
                      <span className="habits-page__item-meta">
                        {habit.frequency === 'daily' ? 'Every day' : `${habit.targetDays?.length || 0} days/week`}
                        {habit.targetCount > 1 && ` • ${habit.targetCount}x daily`}
                      </span>
                    </div>
                  </button>

                  <div className="habits-page__item-actions">
                    {filter === 'active' ? (
                      <button
                        className="habits-page__action-btn"
                        onClick={() => handleArchiveHabit(habit.id)}
                        aria-label="Archive habit"
                        title="Archive"
                      >
                        <Archive size={18} />
                      </button>
                    ) : (
                      <>
                        <button
                          className="habits-page__action-btn habits-page__action-btn--restore"
                          onClick={() => handleRestoreHabit(habit.id)}
                          aria-label="Restore habit"
                          title="Restore"
                        >
                          <RotateCcw size={18} />
                        </button>
                        <button
                          className="habits-page__action-btn habits-page__action-btn--delete"
                          onClick={() => handlePermanentDelete(habit.id)}
                          aria-label="Delete permanently"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </CardGroup>
        ) : (
          <div className="habits-page__empty">
            {filter === 'active' ? (
              <>
                <span className="habits-page__empty-icon">📋</span>
                <h2 className="habits-page__empty-title">No active habits</h2>
                <p className="habits-page__empty-text">
                  Create your first habit to start tracking
                </p>
                <Button icon={Plus} onClick={() => setShowAddSheet(true)}>
                  Add Habit
                </Button>
              </>
            ) : (
              <>
                <span className="habits-page__empty-icon">📦</span>
                <h2 className="habits-page__empty-title">No archived habits</h2>
                <p className="habits-page__empty-text">
                  Archived habits will appear here
                </p>
              </>
            )}
          </div>
        )}
      </section>

      {/* Add Button */}
      {filter === 'active' && habits.length > 0 && (
        <button 
          className="habits-page__fab"
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
