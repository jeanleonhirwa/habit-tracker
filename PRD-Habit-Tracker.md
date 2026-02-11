# Product Requirements Document (PRD)
## HabitFlow - Personal Habit Tracker Web Application

**Version:** 1.0  
**Date:** February 11, 2026  
**Author:** Product Team  

---

## 1. Executive Summary

HabitFlow is a personal web-based habit tracking application designed to help users build and maintain positive habits through beautiful, intuitive interfaces inspired by Apple's Human Interface Guidelines. The application emphasizes local-first data storage for privacy, comprehensive analytics for performance insights, and a motivational design language that encourages consistent engagement.

### 1.1 Product Vision
Create the most elegant, privacy-focused habit tracking experience on the web that motivates users through beautiful design and insightful analytics while keeping their data entirely under their control.

### 1.2 Key Differentiators
- **Apple-Inspired Design**: Clean, professional UI following Apple HIG principles
- **Local-First Architecture**: All data stored permanently in browser with zero server dependency
- **Rich Analytics**: Comprehensive visualizations, charts, and performance insights
- **Motivational UX**: Inspiring interactions, celebrations, and progress feedback

---

## 2. Technical Stack Decision

### 2.1 Frontend Framework: **React 18+ with TypeScript**

**Rationale:**
- Component-based architecture ideal for reusable UI elements
- Strong TypeScript support for type safety and maintainability
- Extensive ecosystem for charting and animation libraries
- Excellent developer tooling and debugging capabilities

### 2.2 Build Tool: **Vite**

**Rationale:**
- Lightning-fast HMR (Hot Module Replacement)
- Optimized production builds with tree-shaking
- Native ES modules support
- Simple configuration with sensible defaults

### 2.3 Styling: **Tailwind CSS + CSS Variables**

**Rationale:**
- Utility-first approach enables rapid Apple-style UI development
- CSS variables for semantic color tokens (Light/Dark mode)
- JIT compilation for minimal bundle size
- Easy implementation of 8pt grid system

### 2.4 Local Data Storage: **IndexedDB via Dexie.js**

**Rationale:**
- Permanent, structured data storage in browser
- Handles large datasets (years of habit data)
- Async API prevents UI blocking
- Dexie.js provides elegant, Promise-based wrapper
- Supports complex queries for analytics

### 2.5 State Management: **Zustand**

**Rationale:**
- Minimal boilerplate compared to Redux
- Built-in persistence middleware for IndexedDB sync
- TypeScript-first design
- Simple API with excellent performance

### 2.6 Charts & Visualization: **Recharts + D3.js**

**Rationale:**
- Recharts: React-native charting with declarative API
- D3.js: Complex custom visualizations (heatmaps, contribution graphs)
- Both support responsive, animated charts
- Lightweight compared to alternatives

### 2.7 Animation: **Framer Motion**

**Rationale:**
- Spring-based physics matching Apple's motion principles
- Gesture support for swipe interactions
- Layout animations for smooth transitions
- Reduced motion preference support built-in

### 2.8 Date Handling: **date-fns**

**Rationale:**
- Modular, tree-shakeable architecture
- Immutable operations
- Comprehensive formatting and calculation utilities
- Lightweight alternative to Moment.js

### 2.9 Icons: **Lucide React**

**Rationale:**
- Clean, consistent icon set resembling SF Symbols
- Multiple weights available
- Tree-shakeable imports
- Active maintenance

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      HabitFlow Web App                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   UI Layer   │  │  Components  │  │   Animation Layer    │   │
│  │  (React +    │  │  (Reusable   │  │   (Framer Motion)    │   │
│  │  Tailwind)   │  │   Library)   │  │                      │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                 │                      │               │
│  ┌──────▼─────────────────▼──────────────────────▼───────────┐  │
│  │                    State Layer (Zustand)                   │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │  │
│  │  │ HabitStore  │ │ SettingsStore│ │  AnalyticsStore    │  │  │
│  │  └─────────────┘ └─────────────┘ └─────────────────────┘  │  │
│  └──────────────────────────┬────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────▼────────────────────────────────┐  │
│  │              Data Persistence Layer (Dexie.js)             │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │  │
│  │  │   Habits    │ │ Completions │ │    Settings         │  │  │
│  │  │   Table     │ │   Table     │ │    Table            │  │  │
│  │  └─────────────┘ └─────────────┘ └─────────────────────┘  │  │
│  └──────────────────────────┬────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────▼────────────────────────────────┐  │
│  │                    IndexedDB (Browser)                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Directory Structure

```
habitflow/
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   │
│   ├── components/
│   │   ├── ui/                    # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Sheet.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Switch.tsx
│   │   │   ├── SegmentedControl.tsx
│   │   │   ├── TabBar.tsx
│   │   │   ├── NavigationBar.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── habits/                # Habit-specific components
│   │   │   ├── HabitCard.tsx
│   │   │   ├── HabitList.tsx
│   │   │   ├── HabitForm.tsx
│   │   │   ├── HabitCheckbox.tsx
│   │   │   ├── HabitStreak.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── analytics/             # Analytics components
│   │   │   ├── StreakChart.tsx
│   │   │   ├── CompletionHeatmap.tsx
│   │   │   ├── WeeklyBarChart.tsx
│   │   │   ├── MonthlyProgress.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── TrendIndicator.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── layout/                # Layout components
│   │       ├── AppShell.tsx
│   │       ├── Sidebar.tsx
│   │       └── index.ts
│   │
│   ├── pages/
│   │   ├── TodayPage.tsx
│   │   ├── HabitsPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── stores/
│   │   ├── habitStore.ts
│   │   ├── settingsStore.ts
│   │   └── analyticsStore.ts
│   │
│   ├── db/
│   │   ├── database.ts            # Dexie database setup
│   │   ├── migrations.ts          # Schema migrations
│   │   └── seed.ts                # Demo data seeding
│   │
│   ├── hooks/
│   │   ├── useHabits.ts
│   │   ├── useAnalytics.ts
│   │   ├── useTheme.ts
│   │   ├── useReducedMotion.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── utils/
│   │   ├── dateUtils.ts
│   │   ├── streakCalculator.ts
│   │   ├── analyticsEngine.ts
│   │   └── exportData.ts
│   │
│   ├── types/
│   │   ├── habit.ts
│   │   ├── completion.ts
│   │   ├── analytics.ts
│   │   └── settings.ts
│   │
│   └── styles/
│       ├── tokens.css             # CSS variables / design tokens
│       └── animations.css
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 4. Data Models & Database Schema

### 4.1 IndexedDB Database: `HabitFlowDB`

#### Habits Table

```typescript
interface Habit {
  id: string;                    // UUID v4
  name: string;                  // "Morning Meditation"
  description?: string;          // Optional description
  icon: string;                  // Lucide icon name
  color: HabitColor;             // Semantic color token
  frequency: FrequencyType;      // daily | weekly | custom
  targetDays?: number[];         // [0,1,2,3,4] (Mon-Fri) for weekly
  targetCount: number;           // Times per period (default: 1)
  reminderTime?: string;         // "08:00" (HH:mm format)
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;             // Soft delete
  order: number;                 // Sort order in list
}

type HabitColor = 
  | 'blue' | 'red' | 'green' | 'orange' 
  | 'purple' | 'pink' | 'teal' | 'indigo';

type FrequencyType = 'daily' | 'weekly' | 'custom';
```

#### Completions Table

```typescript
interface Completion {
  id: string;                    // UUID v4
  habitId: string;               // Foreign key to Habit
  date: string;                  // "2026-02-11" (YYYY-MM-DD)
  count: number;                 // Times completed that day
  completedAt: Date;             // Last completion timestamp
  note?: string;                 // Optional note for the day
}

// Compound index on [habitId, date] for fast queries
```

#### Settings Table

```typescript
interface Settings {
  id: 'user_settings';           // Singleton record
  theme: 'light' | 'dark' | 'system';
  weekStartsOn: 0 | 1;           // 0 = Sunday, 1 = Monday
  showStreakAnimation: boolean;
  enableSounds: boolean;
  defaultReminderTime: string;
  dataExportFormat: 'json' | 'csv';
  lastBackupDate?: Date;
}
```

### 4.2 Dexie.js Schema Definition

```typescript
// src/db/database.ts
import Dexie, { Table } from 'dexie';

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
  }
}

export const db = new HabitFlowDB();
```

---

## 5. State Management Architecture

### 5.1 Zustand Store Structure

#### Habit Store

```typescript
// src/stores/habitStore.ts
interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  archiveHabit: (id: string) => Promise<void>;
  reorderHabits: (habitIds: string[]) => Promise<void>;
  
  // Completions
  toggleCompletion: (habitId: string, date: string) => Promise<void>;
  getCompletionsForDate: (date: string) => Promise<Completion[]>;
  getCompletionsForHabit: (habitId: string, startDate: string, endDate: string) => Promise<Completion[]>;
}
```

#### Settings Store

```typescript
// src/stores/settingsStore.ts
interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  
  // Actions
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  exportData: () => Promise<Blob>;
  importData: (file: File) => Promise<void>;
}
```

#### Analytics Store

```typescript
// src/stores/analyticsStore.ts
interface AnalyticsState {
  dateRange: { start: Date; end: Date };
  selectedHabitId: string | null;
  
  // Computed analytics data
  overallStats: OverallStats | null;
  habitStats: Map<string, HabitStats>;
  
  // Actions
  setDateRange: (start: Date, end: Date) => void;
  selectHabit: (habitId: string | null) => void;
  calculateStats: () => Promise<void>;
}

interface OverallStats {
  totalHabits: number;
  activeHabits: number;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  averageCompletionRate: number;
  bestDay: string;              // Day of week
  bestHabit: string;            // Habit ID with highest rate
}

interface HabitStats {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;       // Percentage
  weeklyTrend: number[];        // Last 7 days
  monthlyTrend: number[];       // Last 30 days
  heatmapData: HeatmapCell[];   // For GitHub-style heatmap
}

interface HeatmapCell {
  date: string;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4; // Color intensity level
}
```

---

## 6. Analytics Engine

### 6.1 Core Analytics Functions

```typescript
// src/utils/analyticsEngine.ts

/**
 * Calculate streak for a habit
 * Streak = consecutive days of completion ending today (or yesterday if today incomplete)
 */
export function calculateStreak(
  completions: Completion[], 
  targetDays?: number[]
): { current: number; longest: number } {
  // Sort by date descending
  // Iterate and count consecutive completions
  // Handle weekly habits (skip non-target days)
}

/**
 * Calculate completion rate
 * Rate = (completed days / expected days) * 100
 */
export function calculateCompletionRate(
  completions: Completion[],
  startDate: Date,
  endDate: Date,
  frequency: FrequencyType,
  targetDays?: number[]
): number {
  // Count expected completion days in range
  // Count actual completions
  // Return percentage
}

/**
 * Generate heatmap data for GitHub-style contribution graph
 */
export function generateHeatmapData(
  completions: Completion[],
  startDate: Date,
  endDate: Date
): HeatmapCell[] {
  // Create array of all dates in range
  // Map completions to intensity levels (0-4)
  // Based on count relative to max count
}

/**
 * Calculate weekly/monthly trends
 */
export function calculateTrend(
  completions: Completion[],
  days: number
): number[] {
  // Return array of completion counts per day
  // For the last N days
}

/**
 * Identify best performing day of week
 */
export function getBestPerformingDay(
  completions: Completion[]
): { day: number; rate: number } {
  // Group completions by day of week
  // Calculate average for each day
  // Return highest
}
```

### 6.2 Analytics Query Patterns

```typescript
// Common IndexedDB queries via Dexie

// Get all completions for a date range
db.completions
  .where('date')
  .between(startDate, endDate)
  .toArray();

// Get completions for specific habit
db.completions
  .where('[habitId+date]')
  .between([habitId, startDate], [habitId, endDate])
  .toArray();

// Get completion count by habit for current month
db.completions
  .where('date')
  .startsWith('2026-02')
  .toArray()
  .then(completions => {
    return completions.reduce((acc, c) => {
      acc[c.habitId] = (acc[c.habitId] || 0) + c.count;
      return acc;
    }, {});
  });
```

---

## 7. Design System Implementation

### 7.1 CSS Design Tokens (Apple-Inspired)

```css
/* src/styles/tokens.css */

:root {
  /* Typography - SF Pro approximation using system fonts */
  --font-system: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 
                 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', monospace;
  
  /* Type Scale (matching Apple HIG) */
  --text-large-title: 34px;
  --text-title-1: 28px;
  --text-title-2: 22px;
  --text-title-3: 20px;
  --text-headline: 17px;
  --text-body: 17px;
  --text-callout: 16px;
  --text-subhead: 15px;
  --text-footnote: 13px;
  --text-caption-1: 12px;
  --text-caption-2: 11px;
  
  /* Spacing (8pt grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-spring: 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Touch targets */
  --touch-target-min: 44px;
}

/* Light Mode (default) */
:root, [data-theme="light"] {
  /* Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F2F2F7;
  --bg-tertiary: #FFFFFF;
  --bg-grouped: #F2F2F7;
  
  /* Text */
  --text-primary: #000000;
  --text-secondary: #3C3C43;
  --text-tertiary: #3C3C4399;
  --text-quaternary: #3C3C434D;
  
  /* Semantic Colors */
  --color-blue: #007AFF;
  --color-green: #34C759;
  --color-red: #FF3B30;
  --color-orange: #FF9500;
  --color-yellow: #FFCC00;
  --color-purple: #AF52DE;
  --color-pink: #FF2D55;
  --color-teal: #5AC8FA;
  --color-indigo: #5856D6;
  
  /* Grays */
  --gray-1: #8E8E93;
  --gray-2: #AEAEB2;
  --gray-3: #C7C7CC;
  --gray-4: #D1D1D6;
  --gray-5: #E5E5EA;
  --gray-6: #F2F2F7;
  
  /* Separator */
  --separator: rgba(60, 60, 67, 0.29);
  --separator-opaque: #C6C6C8;
}

/* Dark Mode */
[data-theme="dark"] {
  /* Backgrounds */
  --bg-primary: #000000;
  --bg-secondary: #1C1C1E;
  --bg-tertiary: #2C2C2E;
  --bg-grouped: #000000;
  
  /* Text */
  --text-primary: #FFFFFF;
  --text-secondary: #EBEBF5;
  --text-tertiary: #EBEBF599;
  --text-quaternary: #EBEBF54D;
  
  /* Semantic Colors (adjusted for dark) */
  --color-blue: #0A84FF;
  --color-green: #30D158;
  --color-red: #FF453A;
  --color-orange: #FF9F0A;
  --color-yellow: #FFD60A;
  --color-purple: #BF5AF2;
  --color-pink: #FF375F;
  --color-teal: #64D2FF;
  --color-indigo: #5E5CE6;
  
  /* Grays (inverted) */
  --gray-1: #8E8E93;
  --gray-2: #636366;
  --gray-3: #48484A;
  --gray-4: #3A3A3C;
  --gray-5: #2C2C2E;
  --gray-6: #1C1C1E;
  
  /* Separator */
  --separator: rgba(84, 84, 88, 0.65);
  --separator-opaque: #38383A;
}
```

### 7.2 Tailwind Configuration

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-system)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        'large-title': ['34px', { lineHeight: '41px', fontWeight: '700' }],
        'title-1': ['28px', { lineHeight: '34px', fontWeight: '700' }],
        'title-2': ['22px', { lineHeight: '28px', fontWeight: '700' }],
        'title-3': ['20px', { lineHeight: '25px', fontWeight: '600' }],
        'headline': ['17px', { lineHeight: '22px', fontWeight: '600' }],
        'body': ['17px', { lineHeight: '22px', fontWeight: '400' }],
        'callout': ['16px', { lineHeight: '21px', fontWeight: '400' }],
        'subhead': ['15px', { lineHeight: '20px', fontWeight: '400' }],
        'footnote': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'caption-1': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'caption-2': ['11px', { lineHeight: '13px', fontWeight: '400' }],
      },
      spacing: {
        '4.5': '18px',
        '11': '44px',
      },
      borderRadius: {
        'apple-sm': '8px',
        'apple-md': '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
      },
      colors: {
        'system-blue': 'var(--color-blue)',
        'system-green': 'var(--color-green)',
        'system-red': 'var(--color-red)',
        'system-orange': 'var(--color-orange)',
        'system-purple': 'var(--color-purple)',
        'system-pink': 'var(--color-pink)',
        'system-teal': 'var(--color-teal)',
        'system-indigo': 'var(--color-indigo)',
      },
      animation: {
        'check-bounce': 'checkBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'streak-glow': 'streakGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
```

---

## 8. UI Component Specifications

### 8.1 Core Components

#### Button Component

```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

// Styling follows Apple HIG:
// - Primary: Filled with system-blue, white text
// - Secondary: Gray background, primary text
// - Destructive: system-red for delete actions
// - Ghost: Transparent, blue text (link style)
// - All: 44px minimum touch height, rounded corners
```

#### Card Component (Grouped List Style)

```typescript
// src/components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
}

// Apple-style grouped card:
// - bg-secondary background
// - 12px border-radius
// - Sits on tertiary/primary background
// - Optional separator between children
```

#### Sheet Component (iOS Modal)

```typescript
// src/components/ui/Sheet.tsx
interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

// Implementation:
// - Slides up from bottom
// - Background scales down slightly (0.95)
// - Grabber handle at top
// - Swipe down to dismiss
// - Backdrop blur on background
```

#### Switch Component

```typescript
// src/components/ui/Switch.tsx
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

// Apple-style toggle:
// - Green when on, gray when off
// - Smooth spring animation
// - 51x31px dimensions (iOS standard)
```

### 8.2 Habit Components

#### HabitCard Component

```typescript
// src/components/habits/HabitCard.tsx
interface HabitCardProps {
  habit: Habit;
  completion: Completion | null;
  onToggle: () => void;
  onEdit: () => void;
}

// Layout:
// ┌──────────────────────────────────────────┐
// │  [Icon]  Habit Name              [✓/○]  │
// │          Current streak: 5 days          │
// └──────────────────────────────────────────┘
// 
// Features:
// - Colored icon based on habit.color
// - Checkbox with bounce animation on complete
// - Streak badge with flame icon
// - Swipe actions: Edit (left), Delete (right)
```

#### CompletionCheckbox Component

```typescript
// src/components/habits/HabitCheckbox.tsx
interface HabitCheckboxProps {
  completed: boolean;
  color: HabitColor;
  onToggle: () => void;
  count?: number;
  targetCount?: number;
}

// States:
// - Empty circle (incomplete)
// - Partially filled (count < targetCount)
// - Full checkmark with color (complete)
// 
// Animation:
// - Scale bounce on check
// - Confetti particles on first completion
// - Haptic feedback simulation (vibration API)
```

### 8.3 Analytics Components

#### CompletionHeatmap Component

```typescript
// src/components/analytics/CompletionHeatmap.tsx
interface CompletionHeatmapProps {
  data: HeatmapCell[];
  habitColor: HabitColor;
  startDate: Date;
  weeks?: number;
  onCellClick?: (date: string) => void;
}

// GitHub-style contribution graph:
// - 7 rows (days of week)
// - N columns (weeks)
// - Color intensity based on completion count
// - Tooltip showing date and count
// - Responsive: scrollable on mobile
```

#### StreakChart Component

```typescript
// src/components/analytics/StreakChart.tsx
interface StreakChartProps {
  currentStreak: number;
  longestStreak: number;
  habitColor: HabitColor;
}

// Visual:
// - Large current streak number
// - Flame icon with animation
// - Progress bar to longest streak
// - Motivational message based on progress
```

#### WeeklyBarChart Component

```typescript
// src/components/analytics/WeeklyBarChart.tsx
interface WeeklyBarChartProps {
  data: { day: string; completed: number; target: number }[];
  color: HabitColor;
}

// Recharts bar chart:
// - 7 bars for days of week
// - Height = completion percentage
// - Current day highlighted
// - Target line overlay
```

#### StatCard Component

```typescript
// src/components/analytics/StatCard.tsx
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { direction: 'up' | 'down' | 'neutral'; percentage: number };
  icon?: LucideIcon;
  color?: HabitColor;
}

// Layout:
// ┌────────────────────┐
// │  📊 Title          │
// │  42                │
// │  ↑ 12% vs last wk  │
// └────────────────────┘
```

---

## 9. Page Specifications

### 9.1 Today Page (Home)

**Purpose**: Primary daily interaction point for habit tracking.

```
┌─────────────────────────────────────────────────────┐
│  ← Today                              [Calendar] ▾  │
│  Wednesday, February 11                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Progress Today                              │   │
│  │  ████████████░░░░░░░░  4/6 habits (67%)    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Morning Routine                                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🧘 Meditation          🔥 12 days    [✓]   │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 💪 Exercise            🔥 5 days     [○]   │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 📖 Read 30 mins        🔥 8 days     [✓]   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Health                                             │
│  ┌─────────────────────────────────────────────┐   │
│  │ 💧 Drink Water (8x)    4/8           [○○○○]│   │
│  ├─────────────────────────────────────────────┤   │
│  │ 🥗 Eat Vegetables      🔥 3 days     [✓]   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│                    [+ Add Habit]                    │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [Today]    [Habits]    [Analytics]    [Settings]   │
└─────────────────────────────────────────────────────┘
```

**Features**:
- Large title with date picker
- Overall progress ring/bar
- Grouped habits by category
- Quick add habit button
- Swipe between dates
- Pull-to-refresh animation

### 9.2 Habits Page

**Purpose**: Manage and organize all habits.

```
┌─────────────────────────────────────────────────────┐
│  Habits                                    [+ Add]  │
├─────────────────────────────────────────────────────┤
│  [All] [Active] [Archived]                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ≡  🧘 Meditation                            │   │
│  │     Daily • 🔥 12 day streak • 89% rate    │   │
│  ├─────────────────────────────────────────────┤   │
│  │ ≡  💪 Exercise                              │   │
│  │     Mon, Wed, Fri • 🔥 5 days • 72% rate   │   │
│  ├─────────────────────────────────────────────┤   │
│  │ ≡  📖 Reading                               │   │
│  │     Daily • 🔥 8 days • 95% rate           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Drag to reorder • Swipe to edit/delete            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Features**:
- Segmented control for filtering
- Drag-and-drop reordering
- Swipe actions (edit/archive/delete)
- Mini stats preview per habit
- Tap to view habit detail sheet

### 9.3 Analytics Page

**Purpose**: Deep insights into habit performance.

```
┌─────────────────────────────────────────────────────┐
│  Analytics                           [This Month ▾] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ 🔥 156   │ │ 📊 78%   │ │ ⭐ 12    │            │
│  │ Total    │ │ Avg Rate │ │ Best     │            │
│  │ Complete │ │ ↑ 5%     │ │ Streak   │            │
│  └──────────┘ └──────────┘ └──────────┘            │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Completion Heatmap (Last 12 weeks)         │   │
│  │  [GitHub-style contribution graph]          │   │
│  │  ░░▓▓██░░▓▓██░░▓▓██░░▓▓██░░▓▓██░░▓▓██     │   │
│  │  ░░▓▓██░░▓▓██░░▓▓██░░▓▓██░░▓▓██░░▓▓██     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Weekly Performance                          │   │
│  │  [Bar chart - 7 days]                       │   │
│  │   █   █       █   █                         │   │
│  │   █ █ █   █   █   █ █                       │   │
│  │   █ █ █ █ █ █ █ █ █ █                       │   │
│  │   M T W T F S S                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Habit Breakdown                             │   │
│  │  [Horizontal bar chart per habit]           │   │
│  │  Meditation   ████████████████░░ 89%        │   │
│  │  Exercise     ██████████████░░░░ 72%        │   │
│  │  Reading      █████████████████░ 95%        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Best Day: Wednesday (92% completion)               │
│  Needs Attention: Exercise (declining trend)        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Features**:
- Date range selector (week/month/year/all-time)
- Summary stat cards with trends
- Interactive heatmap
- Weekly bar chart
- Per-habit performance breakdown
- AI-style insights (best day, attention needed)
- Tap habit for detailed analytics sheet

### 9.4 Settings Page

**Purpose**: App configuration and data management.

```
┌─────────────────────────────────────────────────────┐
│  Settings                                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Appearance                                         │
│  ┌─────────────────────────────────────────────┐   │
│  │  Theme                      [System ▾]      │   │
│  ├─────────────────────────────────────────────┤   │
│  │  App Icon                   [Default ▾]     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Preferences                                        │
│  ┌─────────────────────────────────────────────┐   │
│  │  Week Starts On             [Monday ▾]      │   │
│  ├─────────────────────────────────────────────┤   │
│  │  Default Reminder Time      [08:00 AM]      │   │
│  ├─────────────────────────────────────────────┤   │
│  │  Streak Animations          [====○]         │   │
│  ├─────────────────────────────────────────────┤   │
│  │  Sound Effects              [====○]         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Data                                               │
│  ┌─────────────────────────────────────────────┐   │
│  │  Export Data                           [>]  │   │
│  ├─────────────────────────────────────────────┤   │
│  │  Import Data                           [>]  │   │
│  ├─────────────────────────────────────────────┤   │
│  │  Clear All Data                        [>]  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  About                                              │
│  ┌─────────────────────────────────────────────┐   │
│  │  Version                           1.0.0    │   │
│  ├─────────────────────────────────────────────┤   │
│  │  Privacy Policy                        [>]  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 10. Motion & Animation Specifications

### 10.1 Core Animation Principles (Apple-Inspired)

```typescript
// src/styles/animations.ts
import { Variants } from 'framer-motion';

// Spring configurations matching Apple physics
export const springs = {
  // Snappy interactions (buttons, toggles)
  snappy: { type: 'spring', stiffness: 400, damping: 30 },
  
  // Gentle movements (page transitions)
  gentle: { type: 'spring', stiffness: 200, damping: 25 },
  
  // Bouncy celebrations (streak milestones)
  bouncy: { type: 'spring', stiffness: 300, damping: 15 },
  
  // Quick responses (hover states)
  quick: { type: 'spring', stiffness: 500, damping: 35 },
};

// Reduced motion alternatives
export const reducedMotion = {
  transition: { duration: 0 },
};
```

### 10.2 Key Animations

#### Habit Completion Animation

```typescript
// Checkbox check animation
const checkVariants: Variants = {
  unchecked: { 
    scale: 1, 
    backgroundColor: 'transparent',
    borderColor: 'var(--gray-3)',
  },
  checked: { 
    scale: [1, 1.2, 1],
    backgroundColor: 'var(--color-green)',
    borderColor: 'var(--color-green)',
    transition: springs.bouncy,
  },
};

// Checkmark path animation
const pathVariants: Variants = {
  unchecked: { pathLength: 0, opacity: 0 },
  checked: { 
    pathLength: 1, 
    opacity: 1,
    transition: { delay: 0.1, duration: 0.3 },
  },
};

// Confetti burst on milestone completions
const confettiConfig = {
  particleCount: 50,
  spread: 60,
  origin: { x: 0.5, y: 0.6 },
  colors: ['#007AFF', '#34C759', '#FF9500', '#AF52DE'],
};
```

#### Page Transitions

```typescript
// iOS-style push/pop navigation
const pageVariants: Variants = {
  initial: { 
    x: '100%', 
    opacity: 0.8,
  },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: springs.gentle,
  },
  exit: { 
    x: '-30%', 
    opacity: 0.5,
    transition: springs.gentle,
  },
};

// Sheet presentation (bottom modal)
const sheetVariants: Variants = {
  hidden: { 
    y: '100%',
    opacity: 0.9,
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: springs.gentle,
  },
};

// Background scale effect when sheet opens
const backdropVariants: Variants = {
  normal: { scale: 1, borderRadius: 0 },
  scaled: { 
    scale: 0.95, 
    borderRadius: 12,
    transition: springs.gentle,
  },
};
```

#### Streak Celebration

```typescript
// Fire emoji pulse on streak milestones (7, 14, 21, 30, etc.)
const streakCelebration = {
  scale: [1, 1.5, 1],
  rotate: [0, -10, 10, -10, 0],
  transition: {
    duration: 0.6,
    times: [0, 0.2, 0.4, 0.6, 1],
  },
};

// Glow effect
const streakGlow = {
  boxShadow: [
    '0 0 0 0 rgba(255, 149, 0, 0)',
    '0 0 20px 10px rgba(255, 149, 0, 0.4)',
    '0 0 0 0 rgba(255, 149, 0, 0)',
  ],
  transition: { duration: 2, repeat: Infinity },
};
```

---

## 11. Data Management & Persistence

### 11.1 Data Export/Import

```typescript
// src/utils/exportData.ts

interface ExportData {
  version: string;
  exportedAt: string;
  habits: Habit[];
  completions: Completion[];
  settings: Settings;
}

/**
 * Export all data as JSON
 */
export async function exportAsJSON(): Promise<Blob> {
  const data: ExportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    habits: await db.habits.toArray(),
    completions: await db.completions.toArray(),
    settings: await db.settings.get('user_settings'),
  };
  
  return new Blob(
    [JSON.stringify(data, null, 2)], 
    { type: 'application/json' }
  );
}

/**
 * Export completions as CSV
 */
export async function exportAsCSV(): Promise<Blob> {
  const habits = await db.habits.toArray();
  const completions = await db.completions.toArray();
  
  const habitMap = new Map(habits.map(h => [h.id, h.name]));
  
  const rows = [
    ['Date', 'Habit', 'Completed', 'Count', 'Note'],
    ...completions.map(c => [
      c.date,
      habitMap.get(c.habitId) || 'Unknown',
      'Yes',
      c.count.toString(),
      c.note || '',
    ]),
  ];
  
  const csv = rows.map(r => r.map(escapeCSV).join(',')).join('\n');
  return new Blob([csv], { type: 'text/csv' });
}

/**
 * Import data from JSON file
 */
export async function importFromJSON(file: File): Promise<void> {
  const text = await file.text();
  const data: ExportData = JSON.parse(text);
  
  // Validate version compatibility
  if (!data.version || !data.habits) {
    throw new Error('Invalid backup file format');
  }
  
  // Clear existing data
  await db.transaction('rw', [db.habits, db.completions], async () => {
    await db.habits.clear();
    await db.completions.clear();
    await db.habits.bulkAdd(data.habits);
    await db.completions.bulkAdd(data.completions);
  });
  
  if (data.settings) {
    await db.settings.put(data.settings);
  }
}
```

### 11.2 Data Integrity & Migrations

```typescript
// src/db/migrations.ts

// Version upgrade handlers
db.version(1).stores({
  habits: 'id, createdAt, order, archivedAt',
  completions: 'id, habitId, date, [habitId+date]',
  settings: 'id',
});

// Future migration example
db.version(2).stores({
  habits: 'id, createdAt, order, archivedAt, categoryId',
  completions: 'id, habitId, date, [habitId+date]',
  settings: 'id',
  categories: 'id, name, order', // New table
}).upgrade(tx => {
  // Migrate existing habits to have default category
  return tx.table('habits').toCollection().modify(habit => {
    habit.categoryId = 'default';
  });
});
```

### 11.3 Offline-First Architecture

```typescript
// All data operations are local-first
// No network requests required for core functionality

// Optional: Cloud sync consideration for future
interface SyncConfig {
  enabled: boolean;
  provider: 'icloud' | 'google' | 'custom';
  lastSyncAt: Date;
  conflictResolution: 'local' | 'remote' | 'manual';
}
```

---

## 12. Accessibility Implementation

### 12.1 WCAG 2.1 AA Compliance

| Requirement | Implementation |
|------------|----------------|
| Color Contrast | 4.5:1 minimum for text, verified in both themes |
| Touch Targets | 44x44px minimum for all interactive elements |
| Keyboard Navigation | Full tab navigation, Enter/Space activation |
| Screen Reader | Semantic HTML, ARIA labels, live regions |
| Reduced Motion | `prefers-reduced-motion` media query respected |
| Focus Indicators | Visible focus rings on all interactive elements |

### 12.2 React Accessibility Patterns

```typescript
// Custom hook for reduced motion preference
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);
  
  return reducedMotion;
}

// Accessible habit checkbox
<button
  role="checkbox"
  aria-checked={completed}
  aria-label={`${habitName}, ${completed ? 'completed' : 'not completed'}, ${streak} day streak`}
  onClick={onToggle}
  className="min-h-[44px] min-w-[44px]"
>
  {/* Visual checkbox */}
</button>

// Live region for streak announcements
<div 
  role="status" 
  aria-live="polite" 
  className="sr-only"
>
  {streakMessage}
</div>
```

---

## 13. Performance Optimization

### 13.1 Bundle Optimization

| Strategy | Implementation |
|----------|----------------|
| Code Splitting | React.lazy() for page components |
| Tree Shaking | ES modules, named imports only |
| Image Optimization | SVG icons, no raster images |
| CSS Optimization | Tailwind JIT, purge unused styles |
| Dependency Audit | Bundle analyzer, lightweight alternatives |

### 13.2 Runtime Performance

```typescript
// Virtualized list for large habit histories
import { useVirtualizer } from '@tanstack/react-virtual';

// Memoized analytics calculations
const habitStats = useMemo(() => 
  calculateHabitStats(completions, dateRange),
  [completions, dateRange]
);

// Debounced search/filter
const debouncedSearch = useDebouncedCallback(
  (query: string) => filterHabits(query),
  300
);

// IndexedDB query optimization
// Use compound indexes for common queries
// Batch writes in transactions
// Limit result sets for large date ranges
```

### 13.3 Target Metrics

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Performance | > 90 |
| Bundle Size (gzipped) | < 150KB |
| IndexedDB Query Time | < 50ms |

---

## 14. Testing Strategy

### 14.1 Test Coverage Requirements

| Layer | Coverage Target | Tools |
|-------|----------------|-------|
| Unit Tests | 80% | Vitest, Testing Library |
| Component Tests | 70% | Testing Library, MSW |
| Integration Tests | Key Flows | Playwright |
| Accessibility Tests | All Components | axe-core, jest-axe |
| Visual Regression | Critical UI | Chromatic (optional) |

### 14.2 Critical Test Scenarios

```typescript
// Habit completion flow
describe('Habit Completion', () => {
  it('should toggle habit completion for today');
  it('should update streak count on completion');
  it('should persist completion to IndexedDB');
  it('should show celebration animation on milestone');
  it('should handle rapid toggle clicks (debounce)');
});

// Analytics calculations
describe('Analytics Engine', () => {
  it('should calculate current streak correctly');
  it('should handle gaps in weekly habits');
  it('should generate accurate heatmap data');
  it('should calculate completion rate with date ranges');
});

// Data persistence
describe('Data Persistence', () => {
  it('should persist habits across page reloads');
  it('should export data as valid JSON');
  it('should import data and restore state');
  it('should handle schema migrations');
});
```

---

## 15. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

| Task | Priority | Estimate |
|------|----------|----------|
| Project setup (Vite, React, TypeScript, Tailwind) | P0 | 2h |
| Design tokens & base styles | P0 | 4h |
| IndexedDB setup with Dexie | P0 | 4h |
| Zustand stores (habits, settings) | P0 | 6h |
| Core UI components (Button, Card, Switch, Sheet) | P0 | 8h |
| Tab navigation & routing | P0 | 4h |

### Phase 2: Core Features (Week 3-4)

| Task | Priority | Estimate |
|------|----------|----------|
| Today page with habit list | P0 | 8h |
| Habit CRUD operations | P0 | 6h |
| Completion toggle with animation | P0 | 6h |
| Streak calculation engine | P0 | 4h |
| Habits management page | P0 | 6h |
| Dark mode implementation | P1 | 4h |

### Phase 3: Analytics (Week 5-6)

| Task | Priority | Estimate |
|------|----------|----------|
| Analytics data aggregation | P0 | 8h |
| Stat cards with trends | P0 | 4h |
| Completion heatmap (D3) | P0 | 8h |
| Weekly bar chart (Recharts) | P0 | 4h |
| Per-habit analytics sheet | P1 | 6h |
| Insights generation | P1 | 4h |

### Phase 4: Polish (Week 7-8)

| Task | Priority | Estimate |
|------|----------|----------|
| Page transitions & animations | P1 | 8h |
| Celebration effects (confetti) | P2 | 4h |
| Settings page | P1 | 4h |
| Data export/import | P1 | 6h |
| Accessibility audit & fixes | P0 | 8h |
| Performance optimization | P1 | 6h |
| Testing & bug fixes | P0 | 12h |

### Phase 5: Launch Preparation (Week 9)

| Task | Priority | Estimate |
|------|----------|----------|
| PWA configuration | P1 | 4h |
| Final QA pass | P0 | 8h |
| Documentation | P1 | 4h |
| Deployment setup | P0 | 4h |

---

## 16. Dependencies & Package Versions

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "zustand": "^4.5.0",
    "dexie": "^3.2.4",
    "dexie-react-hooks": "^1.1.6",
    "framer-motion": "^11.0.0",
    "recharts": "^2.12.0",
    "d3": "^7.8.5",
    "date-fns": "^3.3.0",
    "lucide-react": "^0.330.0",
    "uuid": "^9.0.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.1.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "vitest": "^1.2.0",
    "@testing-library/react": "^14.2.0",
    "@testing-library/jest-dom": "^6.4.0",
    "playwright": "^1.41.0",
    "@types/react": "^18.2.0",
    "@types/d3": "^7.4.0",
    "@types/uuid": "^9.0.0"
  }
}
```

---

## 17. Success Metrics

### 17.1 Technical KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lighthouse Score | > 90 (all categories) | CI/CD pipeline |
| Bundle Size | < 150KB gzipped | Build output |
| Test Coverage | > 80% | Vitest coverage |
| Accessibility Score | 100% | axe-core |
| Time to Interactive | < 3s | Lighthouse |

### 17.2 User Experience Goals

| Goal | Success Indicator |
|------|-------------------|
| Habit tracking is effortless | < 2 taps to complete a habit |
| Analytics are insightful | Users can identify trends in < 10s |
| App feels native | Consistent 60fps animations |
| Data is safe | Zero data loss, easy backup/restore |
| Works offline | Full functionality without network |

---

## 18. Appendix

### 18.1 Glossary

| Term | Definition |
|------|------------|
| Streak | Consecutive days of habit completion |
| Completion Rate | Percentage of expected completions achieved |
| Heatmap | Visual grid showing completion intensity over time |
| IndexedDB | Browser-based NoSQL database for local storage |
| Spring Animation | Physics-based animation with natural deceleration |

### 18.2 References

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Dexie.js Documentation](https://dexie.org/docs/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Recharts Documentation](https://recharts.org/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Document Version History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-11 | Product Team | Initial PRD creation |

