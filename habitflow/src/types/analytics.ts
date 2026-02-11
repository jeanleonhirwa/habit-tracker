export interface OverallStats {
  totalHabits: number;
  activeHabits: number;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  averageCompletionRate: number;
  bestDay: string;
  bestHabitId: string | null;
}

export interface HabitStats {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
  weeklyTrend: number[];
  monthlyTrend: number[];
  heatmapData: HeatmapCell[];
}

export interface HeatmapCell {
  date: string;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface WeeklyData {
  day: string;
  dayShort: string;
  date: string;
  completed: number;
  target: number;
  isToday: boolean;
}

export interface TrendData {
  direction: 'up' | 'down' | 'neutral';
  percentage: number;
}
