import Dexie, { Table } from 'dexie';
import { Habit, Completion } from '../types/habit';
import { Settings, defaultSettings } from '../types/settings';

export class HabitFlowDB extends Dexie {
  habits!: Table<Habit>;
  completions!: Table<Completion>;
  settings!: Table<Settings>;

  constructor() {
    super('HabitFlowDB');
    
    this.version(1).stores({
      habits: 'id, createdAt, order, archivedAt',
      completions: 'id, habitId, date, [habitId+date]',
      settings: 'id'
    });

    // Initialize default settings if not exists
    this.on('ready', async () => {
      const existingSettings = await this.settings.get('user_settings');
      if (!existingSettings) {
        await this.settings.add(defaultSettings);
      }
    });
  }
}

export const db = new HabitFlowDB();

// Helper functions for database operations
export async function getAllHabits(includeArchived = false): Promise<Habit[]> {
  if (includeArchived) {
    return db.habits.orderBy('order').toArray();
  }
  return db.habits
    .where('archivedAt')
    .equals(undefined as unknown as Date)
    .or('archivedAt')
    .equals(null as unknown as Date)
    .sortBy('order');
}

export async function getActiveHabits(): Promise<Habit[]> {
  const habits = await db.habits.toArray();
  return habits
    .filter(h => !h.archivedAt)
    .sort((a, b) => a.order - b.order);
}

export async function getHabitById(id: string): Promise<Habit | undefined> {
  return db.habits.get(id);
}

export async function getCompletionsForDate(date: string): Promise<Completion[]> {
  return db.completions.where('date').equals(date).toArray();
}

export async function getCompletionsForHabit(
  habitId: string, 
  startDate: string, 
  endDate: string
): Promise<Completion[]> {
  return db.completions
    .where('[habitId+date]')
    .between([habitId, startDate], [habitId, endDate], true, true)
    .toArray();
}

export async function getCompletionsInRange(
  startDate: string, 
  endDate: string
): Promise<Completion[]> {
  return db.completions
    .where('date')
    .between(startDate, endDate, true, true)
    .toArray();
}

export async function getSettings(): Promise<Settings> {
  const settings = await db.settings.get('user_settings');
  return settings || defaultSettings;
}

export async function updateSettings(updates: Partial<Settings>): Promise<void> {
  await db.settings.update('user_settings', updates);
}
