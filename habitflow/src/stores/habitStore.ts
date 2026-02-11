import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { db, getActiveHabits, getCompletionsForDate } from '../db/database';
import { Habit, Completion, HabitWithCompletion, HabitColor, FrequencyType } from '../types/habit';
import { formatDateKey, getTodayKey } from '../utils/dateUtils';
import { calculateStreak } from '../utils/streakCalculator';

interface HabitState {
  habits: Habit[];
  completions: Map<string, Completion[]>; // date -> completions
  isLoading: boolean;
  error: string | null;
  selectedDate: string;

  // Actions
  fetchHabits: () => Promise<void>;
  fetchCompletionsForDate: (date: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => Promise<Habit>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  archiveHabit: (id: string) => Promise<void>;
  restoreHabit: (id: string) => Promise<void>;
  reorderHabits: (habitIds: string[]) => Promise<void>;
  toggleCompletion: (habitId: string, date?: string) => Promise<void>;
  setSelectedDate: (date: string) => void;
  getHabitsWithCompletions: (date: string) => Promise<HabitWithCompletion[]>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  completions: new Map(),
  isLoading: false,
  error: null,
  selectedDate: getTodayKey(),

  fetchHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const habits = await getActiveHabits();
      set({ habits, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch habits', isLoading: false });
    }
  },

  fetchCompletionsForDate: async (date: string) => {
    try {
      const dayCompletions = await getCompletionsForDate(date);
      const completions = new Map(get().completions);
      completions.set(date, dayCompletions);
      set({ completions });
    } catch (error) {
      console.error('Failed to fetch completions:', error);
    }
  },

  addHabit: async (habitData) => {
    const habits = get().habits;
    const newHabit: Habit = {
      ...habitData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      order: habits.length,
    };

    await db.habits.add(newHabit);
    set({ habits: [...habits, newHabit] });
    return newHabit;
  },

  updateHabit: async (id, updates) => {
    const updatedHabit = { ...updates, updatedAt: new Date() };
    await db.habits.update(id, updatedHabit);
    
    set({
      habits: get().habits.map(h => 
        h.id === id ? { ...h, ...updatedHabit } : h
      )
    });
  },

  deleteHabit: async (id) => {
    await db.transaction('rw', [db.habits, db.completions], async () => {
      await db.habits.delete(id);
      await db.completions.where('habitId').equals(id).delete();
    });
    
    set({ habits: get().habits.filter(h => h.id !== id) });
  },

  archiveHabit: async (id) => {
    await db.habits.update(id, { archivedAt: new Date(), updatedAt: new Date() });
    set({ habits: get().habits.filter(h => h.id !== id) });
  },

  restoreHabit: async (id) => {
    await db.habits.update(id, { archivedAt: undefined, updatedAt: new Date() });
    await get().fetchHabits();
  },

  reorderHabits: async (habitIds) => {
    const updates = habitIds.map((id, index) => ({ id, order: index }));
    
    await db.transaction('rw', db.habits, async () => {
      for (const update of updates) {
        await db.habits.update(update.id, { order: update.order });
      }
    });

    const habits = get().habits;
    const reordered = habitIds
      .map(id => habits.find(h => h.id === id))
      .filter((h): h is Habit => h !== undefined);
    
    set({ habits: reordered });
  },

  toggleCompletion: async (habitId, date = getTodayKey()) => {
    const habit = get().habits.find(h => h.id === habitId);
    if (!habit) return;

    const completions = get().completions.get(date) || [];
    const existing = completions.find(c => c.habitId === habitId);

    if (existing) {
      if (existing.count < habit.targetCount) {
        // Increment count
        const newCount = existing.count + 1;
        await db.completions.update(existing.id, { 
          count: newCount, 
          completedAt: new Date() 
        });
        
        const updatedCompletions = completions.map(c =>
          c.id === existing.id ? { ...c, count: newCount, completedAt: new Date() } : c
        );
        const newMap = new Map(get().completions);
        newMap.set(date, updatedCompletions);
        set({ completions: newMap });
      } else {
        // Reset to 0 (uncomplete)
        await db.completions.delete(existing.id);
        
        const updatedCompletions = completions.filter(c => c.id !== existing.id);
        const newMap = new Map(get().completions);
        newMap.set(date, updatedCompletions);
        set({ completions: newMap });
      }
    } else {
      // Create new completion
      const newCompletion: Completion = {
        id: uuidv4(),
        habitId,
        date,
        count: 1,
        completedAt: new Date(),
      };
      
      await db.completions.add(newCompletion);
      
      const newMap = new Map(get().completions);
      newMap.set(date, [...completions, newCompletion]);
      set({ completions: newMap });
    }
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().fetchCompletionsForDate(date);
  },

  getHabitsWithCompletions: async (date) => {
    const habits = get().habits;
    let completions = get().completions.get(date);
    
    if (!completions) {
      await get().fetchCompletionsForDate(date);
      completions = get().completions.get(date) || [];
    }

    const habitsWithCompletions: HabitWithCompletion[] = await Promise.all(
      habits.map(async (habit) => {
        const completion = completions!.find(c => c.habitId === habit.id) || null;
        
        // Get all completions for this habit to calculate streak
        const allCompletions = await db.completions
          .where('habitId')
          .equals(habit.id)
          .toArray();
        
        const streak = calculateStreak(allCompletions, habit.frequency, habit.targetDays);
        
        return {
          ...habit,
          completion,
          currentStreak: streak.current,
        };
      })
    );

    return habitsWithCompletions;
  },
}));
