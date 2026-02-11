import { 
  format, 
  parseISO, 
  startOfDay, 
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  subDays,
  differenceInDays,
  isToday,
  isYesterday,
  isSameDay,
  getDay,
  eachDayOfInterval
} from 'date-fns';

// Format date to YYYY-MM-DD string
export function formatDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

// Parse YYYY-MM-DD string to Date
export function parseDateKey(dateKey: string): Date {
  return parseISO(dateKey);
}

// Get today's date key
export function getTodayKey(): string {
  return formatDateKey(new Date());
}

// Format date for display
export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(d)) {
    return 'Today';
  }
  if (isYesterday(d)) {
    return 'Yesterday';
  }
  return format(d, 'EEEE, MMMM d');
}

// Format date for short display
export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d');
}

// Get day of week (0 = Sunday, 1 = Monday, etc.)
export function getDayOfWeek(date: Date | string): number {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return getDay(d);
}

// Get day name
export function getDayName(dayIndex: number, short = false): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return short ? shortDays[dayIndex] : days[dayIndex];
}

// Get week range
export function getWeekRange(date: Date, weekStartsOn: 0 | 1 = 1): { start: Date; end: Date } {
  return {
    start: startOfWeek(date, { weekStartsOn }),
    end: endOfWeek(date, { weekStartsOn })
  };
}

// Get month range
export function getMonthRange(date: Date): { start: Date; end: Date } {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date)
  };
}

// Get last N days
export function getLastNDays(n: number, fromDate: Date = new Date()): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    days.push(formatDateKey(subDays(fromDate, i)));
  }
  return days;
}

// Get all dates in range
export function getDatesInRange(start: Date, end: Date): string[] {
  return eachDayOfInterval({ start, end }).map(formatDateKey);
}

// Check if habit should be done on a specific day
export function shouldCompleteOnDay(
  date: Date | string,
  frequency: 'daily' | 'weekly' | 'custom',
  targetDays?: number[]
): boolean {
  if (frequency === 'daily') {
    return true;
  }
  
  const dayOfWeek = getDayOfWeek(date);
  
  if (frequency === 'weekly' || frequency === 'custom') {
    return targetDays ? targetDays.includes(dayOfWeek) : true;
  }
  
  return true;
}

// Get the number of expected completion days in a range
export function getExpectedDaysInRange(
  startDate: string,
  endDate: string,
  frequency: 'daily' | 'weekly' | 'custom',
  targetDays?: number[]
): number {
  const dates = getDatesInRange(parseDateKey(startDate), parseDateKey(endDate));
  return dates.filter(d => shouldCompleteOnDay(d, frequency, targetDays)).length;
}

export {
  format,
  parseISO,
  startOfDay,
  endOfDay,
  addDays,
  subDays,
  differenceInDays,
  isToday,
  isYesterday,
  isSameDay
};
