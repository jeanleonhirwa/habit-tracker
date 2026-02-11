import { Completion, FrequencyType } from '../types/habit';
import { 
  formatDateKey, 
  parseDateKey, 
  subDays, 
  shouldCompleteOnDay,
  getTodayKey
} from './dateUtils';

interface StreakResult {
  current: number;
  longest: number;
}

export function calculateStreak(
  completions: Completion[],
  frequency: FrequencyType = 'daily',
  targetDays?: number[]
): StreakResult {
  if (completions.length === 0) {
    return { current: 0, longest: 0 };
  }

  // Create a set of completed dates for quick lookup
  const completedDates = new Set(
    completions
      .filter(c => c.count > 0)
      .map(c => c.date)
  );

  const today = getTodayKey();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Calculate current streak (going backwards from today)
  let checkDate = today;
  let foundStart = false;

  // First check if today or yesterday is completed (to start the streak)
  const todayCompleted = completedDates.has(today);
  const yesterdayKey = formatDateKey(subDays(new Date(), 1));
  const yesterdayCompleted = completedDates.has(yesterdayKey);

  if (todayCompleted || yesterdayCompleted) {
    // Start from the most recent completed day
    checkDate = todayCompleted ? today : yesterdayKey;
    foundStart = true;
  }

  if (foundStart) {
    // Count backwards
    let currentDate = parseDateKey(checkDate);
    while (true) {
      const dateKey = formatDateKey(currentDate);
      
      // Check if this day should count
      if (!shouldCompleteOnDay(currentDate, frequency, targetDays)) {
        // Skip this day - doesn't break streak
        currentDate = subDays(currentDate, 1);
        continue;
      }
      
      if (completedDates.has(dateKey)) {
        currentStreak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
      
      // Safety limit
      if (currentStreak > 1000) break;
    }
  }

  // Calculate longest streak (scan all completions)
  const sortedDates = Array.from(completedDates).sort();
  
  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = parseDateKey(sortedDates[i]);
    
    if (i === 0) {
      tempStreak = 1;
    } else {
      
      // Check if consecutive (accounting for skipped days)
      let daysBetween = 1;
      let expectedDate = subDays(currentDate, daysBetween);
      let isConsecutive = false;
      
      // Look back up to 7 days to account for weekly habits
      while (daysBetween <= 7) {
        if (formatDateKey(expectedDate) === sortedDates[i - 1]) {
          // Check if any skipped days should have been completed
          let allSkippedDaysValid = true;
          for (let d = 1; d < daysBetween; d++) {
            const skippedDate = subDays(currentDate, d);
            if (shouldCompleteOnDay(skippedDate, frequency, targetDays)) {
              allSkippedDaysValid = false;
              break;
            }
          }
          if (allSkippedDaysValid) {
            isConsecutive = true;
          }
          break;
        }
        daysBetween++;
        expectedDate = subDays(currentDate, daysBetween);
      }
      
      if (isConsecutive) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  return { 
    current: currentStreak, 
    longest: Math.max(longestStreak, currentStreak) 
  };
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your streak today!";
  if (streak === 1) return "Great start! Keep it going!";
  if (streak < 7) return `${streak} days! Building momentum!`;
  if (streak === 7) return "🎉 One week streak!";
  if (streak < 14) return `${streak} days! You're on fire!`;
  if (streak === 14) return "🎉 Two weeks strong!";
  if (streak < 21) return `${streak} days! Incredible!`;
  if (streak === 21) return "🎉 Three weeks! Habit forming!";
  if (streak < 30) return `${streak} days! Almost a month!`;
  if (streak === 30) return "🎉 One month streak!";
  if (streak < 60) return `${streak} days! Unstoppable!`;
  if (streak === 60) return "🎉 Two months!";
  if (streak < 90) return `${streak} days! Legend status!`;
  if (streak === 90) return "🎉 Three months!";
  if (streak < 365) return `${streak} days! Truly inspiring!`;
  if (streak === 365) return "🎉 ONE YEAR! INCREDIBLE!";
  return `${streak} days! You're a habit master!`;
}

export function isStreakMilestone(streak: number): boolean {
  const milestones = [7, 14, 21, 30, 60, 90, 100, 150, 200, 250, 300, 365, 500, 1000];
  return milestones.includes(streak);
}
