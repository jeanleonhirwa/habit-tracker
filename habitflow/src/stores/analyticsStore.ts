import { create } from 'zustand';
import { db, getCompletionsInRange, getActiveHabits } from '../db/database';
import { Habit, Completion } from '../types/habit';
import { OverallStats, HabitStats, HeatmapCell, WeeklyData } from '../types/analytics';
import { 
  formatDateKey, 
  getTodayKey, 
  getLastNDays, 
  getDayName,
  parseDateKey,
  subDays,
  shouldCompleteOnDay,
  getExpectedDaysInRange
} from '../utils/dateUtils';
import { calculateStreak } from '../utils/streakCalculator';

interface AnalyticsState {
  dateRange: { start: string; end: string };
  selectedHabitId: string | null;
  overallStats: OverallStats | null;
  habitStats: Map<string, HabitStats>;
  isLoading: boolean;

  // Actions
  setDateRange: (start: string, end: string) => void;
  selectHabit: (habitId: string | null) => void;
  calculateOverallStats: () => Promise<void>;
  calculateHabitStats: (habitId: string) => Promise<HabitStats | null>;
  getWeeklyData: () => Promise<WeeklyData[]>;
  getHeatmapData: (habitId?: string, weeks?: number) => Promise<HeatmapCell[]>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  dateRange: {
    start: formatDateKey(subDays(new Date(), 30)),
    end: getTodayKey(),
  },
  selectedHabitId: null,
  overallStats: null,
  habitStats: new Map(),
  isLoading: false,

  setDateRange: (start, end) => {
    set({ dateRange: { start, end } });
  },

  selectHabit: (habitId) => {
    set({ selectedHabitId: habitId });
  },

  calculateOverallStats: async () => {
    set({ isLoading: true });
    try {
      const habits = await getActiveHabits();
      const { start, end } = get().dateRange;
      const completions = await getCompletionsInRange(start, end);
      
      // Group completions by habit
      const completionsByHabit = new Map<string, Completion[]>();
      completions.forEach(c => {
        const existing = completionsByHabit.get(c.habitId) || [];
        completionsByHabit.set(c.habitId, [...existing, c]);
      });

      // Calculate stats
      let totalCompletions = 0;
      let totalExpected = 0;
      let bestHabitId: string | null = null;
      let bestHabitRate = 0;

      // Day of week completion counts
      const dayCompletions: number[] = [0, 0, 0, 0, 0, 0, 0];
      const dayExpected: number[] = [0, 0, 0, 0, 0, 0, 0];

      for (const habit of habits) {
        const habitCompletions = completionsByHabit.get(habit.id) || [];
        const completed = habitCompletions.reduce((sum, c) => sum + c.count, 0);
        const expected = getExpectedDaysInRange(start, end, habit.frequency, habit.targetDays) * habit.targetCount;
        
        totalCompletions += completed;
        totalExpected += expected;

        const rate = expected > 0 ? completed / expected : 0;
        if (rate > bestHabitRate) {
          bestHabitRate = rate;
          bestHabitId = habit.id;
        }

        // Count by day of week
        habitCompletions.forEach(c => {
          const dayIndex = parseDateKey(c.date).getDay();
          dayCompletions[dayIndex] += c.count;
        });
      }

      // Calculate best day
      const bestDayIndex = dayCompletions.indexOf(Math.max(...dayCompletions));

      // Calculate overall streaks (any habit completed = day counts)
      const allDates = new Set<string>();
      completions.forEach(c => {
        if (c.count > 0) allDates.add(c.date);
      });
      
      const sortedDates = Array.from(allDates).sort();
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      // Current streak from today
      let checkDate = getTodayKey();
      while (allDates.has(checkDate)) {
        currentStreak++;
        checkDate = formatDateKey(subDays(parseDateKey(checkDate), 1));
      }
      // Check if yesterday was completed (streak continues)
      if (currentStreak === 0) {
        checkDate = formatDateKey(subDays(new Date(), 1));
        while (allDates.has(checkDate)) {
          currentStreak++;
          checkDate = formatDateKey(subDays(parseDateKey(checkDate), 1));
        }
      }

      // Longest streak
      for (let i = 0; i < sortedDates.length; i++) {
        if (i === 0) {
          tempStreak = 1;
        } else {
          const prev = parseDateKey(sortedDates[i - 1]);
          const curr = parseDateKey(sortedDates[i]);
          const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
          tempStreak = diff === 1 ? tempStreak + 1 : 1;
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }

      const overallStats: OverallStats = {
        totalHabits: habits.length,
        activeHabits: habits.filter(h => !h.archivedAt).length,
        totalCompletions,
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
        averageCompletionRate: totalExpected > 0 ? (totalCompletions / totalExpected) * 100 : 0,
        bestDay: getDayName(bestDayIndex),
        bestHabitId,
      };

      set({ overallStats, isLoading: false });
    } catch (error) {
      console.error('Failed to calculate stats:', error);
      set({ isLoading: false });
    }
  },

  calculateHabitStats: async (habitId) => {
    const habit = await db.habits.get(habitId);
    if (!habit) return null;

    const completions = await db.completions
      .where('habitId')
      .equals(habitId)
      .toArray();

    const { start, end } = get().dateRange;
    const rangeCompletions = completions.filter(
      c => c.date >= start && c.date <= end
    );

    const streak = calculateStreak(completions, habit.frequency, habit.targetDays);
    const expected = getExpectedDaysInRange(start, end, habit.frequency, habit.targetDays) * habit.targetCount;
    const completed = rangeCompletions.reduce((sum, c) => sum + c.count, 0);

    // Weekly trend (last 7 days)
    const last7Days = getLastNDays(7);
    const weeklyTrend = last7Days.map(date => {
      const dayCompletion = completions.find(c => c.date === date);
      return dayCompletion ? dayCompletion.count : 0;
    });

    // Monthly trend (last 30 days)
    const last30Days = getLastNDays(30);
    const monthlyTrend = last30Days.map(date => {
      const dayCompletion = completions.find(c => c.date === date);
      return dayCompletion ? dayCompletion.count : 0;
    });

    // Heatmap data
    const heatmapData = await get().getHeatmapData(habitId, 12);

    const stats: HabitStats = {
      habitId,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      totalCompletions: completed,
      completionRate: expected > 0 ? (completed / expected) * 100 : 0,
      weeklyTrend,
      monthlyTrend,
      heatmapData,
    };

    const habitStats = new Map(get().habitStats);
    habitStats.set(habitId, stats);
    set({ habitStats });

    return stats;
  },

  getWeeklyData: async () => {
    const habits = await getActiveHabits();
    const last7Days = getLastNDays(7);
    const today = getTodayKey();

    const weeklyData: WeeklyData[] = await Promise.all(
      last7Days.map(async (date) => {
        const completions = await db.completions.where('date').equals(date).toArray();
        
        let completed = 0;
        let target = 0;

        habits.forEach(habit => {
          if (shouldCompleteOnDay(date, habit.frequency, habit.targetDays)) {
            target += habit.targetCount;
            const habitCompletion = completions.find(c => c.habitId === habit.id);
            completed += habitCompletion ? Math.min(habitCompletion.count, habit.targetCount) : 0;
          }
        });

        const dateObj = parseDateKey(date);
        return {
          day: getDayName(dateObj.getDay()),
          dayShort: getDayName(dateObj.getDay(), true),
          date,
          completed,
          target,
          isToday: date === today,
        };
      })
    );

    return weeklyData;
  },

  getHeatmapData: async (habitId?: string, weeks = 12) => {
    const days = weeks * 7;
    const dates = getLastNDays(days);
    
    let completions: Completion[];
    if (habitId) {
      completions = await db.completions
        .where('habitId')
        .equals(habitId)
        .toArray();
    } else {
      completions = await db.completions.toArray();
    }

    // Find max count for intensity calculation
    const completionMap = new Map<string, number>();
    completions.forEach(c => {
      const existing = completionMap.get(c.date) || 0;
      completionMap.set(c.date, existing + c.count);
    });

    const maxCount = Math.max(...Array.from(completionMap.values()), 1);

    const heatmapData: HeatmapCell[] = dates.map(date => {
      const count = completionMap.get(date) || 0;
      let intensity: 0 | 1 | 2 | 3 | 4 = 0;
      
      if (count > 0) {
        const ratio = count / maxCount;
        if (ratio <= 0.25) intensity = 1;
        else if (ratio <= 0.5) intensity = 2;
        else if (ratio <= 0.75) intensity = 3;
        else intensity = 4;
      }

      return { date, count, intensity };
    });

    return heatmapData;
  },
}));
