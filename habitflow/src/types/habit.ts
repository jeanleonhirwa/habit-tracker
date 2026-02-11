export type HabitColor = 
  | 'blue' 
  | 'red' 
  | 'green' 
  | 'orange' 
  | 'purple' 
  | 'pink' 
  | 'teal' 
  | 'indigo';

export type FrequencyType = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: HabitColor;
  frequency: FrequencyType;
  targetDays?: number[]; // 0=Sun, 1=Mon, etc.
  targetCount: number;
  reminderTime?: string;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
  order: number;
}

export interface Completion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  count: number;
  completedAt: Date;
  note?: string;
}

export interface HabitWithCompletion extends Habit {
  completion: Completion | null;
  currentStreak: number;
}
