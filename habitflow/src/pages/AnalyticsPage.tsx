import React, { useEffect, useState } from 'react';
import { Flame, Target, TrendingUp, Calendar } from 'lucide-react';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { useHabitStore } from '../stores/habitStore';
import { StatCard, WeeklyChart, Heatmap } from '../components/analytics';
import { SegmentedControl } from '../components/ui';
import { WeeklyData, HeatmapCell } from '../types/analytics';
import './AnalyticsPage.css';

type DateRangeType = 'week' | 'month' | 'year';

export function AnalyticsPage() {
  const { habits } = useHabitStore();
  const { 
    overallStats, 
    calculateOverallStats, 
    getWeeklyData, 
    getHeatmapData,
    isLoading 
  } = useAnalyticsStore();

  const [dateRange, setDateRange] = useState<DateRangeType>('month');
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [habits, dateRange]);

  const loadAnalytics = async () => {
    await calculateOverallStats();
    const weekly = await getWeeklyData();
    setWeeklyData(weekly);
    
    const weeks = dateRange === 'week' ? 2 : dateRange === 'month' ? 5 : 52;
    const heatmap = await getHeatmapData(undefined, weeks);
    setHeatmapData(heatmap);
  };

  if (habits.length === 0) {
    return (
      <div className="page analytics-page">
        <header className="page__header">
          <h1 className="page__title">Analytics</h1>
          <p className="page__subtitle">Track your progress</p>
        </header>
        
        <div className="analytics-page__empty">
          <span className="analytics-page__empty-icon">📊</span>
          <h2 className="analytics-page__empty-title">No data yet</h2>
          <p className="analytics-page__empty-text">
            Start tracking habits to see your analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page analytics-page">
      {/* Header */}
      <header className="page__header">
        <h1 className="page__title">Analytics</h1>
        <p className="page__subtitle">Track your progress</p>
      </header>

      {/* Date Range Filter */}
      <div className="analytics-page__filter">
        <SegmentedControl
          options={[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
          value={dateRange}
          onChange={setDateRange}
          fullWidth
        />
      </div>

      {/* Stats Grid */}
      <section className="analytics-page__stats">
        <StatCard
          title="Current Streak"
          value={overallStats?.currentStreak || 0}
          subtitle="days"
          icon={Flame}
          color="orange"
        />
        <StatCard
          title="Completion Rate"
          value={`${Math.round(overallStats?.averageCompletionRate || 0)}%`}
          icon={Target}
          color="green"
        />
        <StatCard
          title="Total Completions"
          value={overallStats?.totalCompletions || 0}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Best Day"
          value={overallStats?.bestDay || '-'}
          icon={Calendar}
          color="purple"
        />
      </section>

      {/* Weekly Chart */}
      <section className="analytics-page__section">
        <h2 className="analytics-page__section-title">This Week</h2>
        <WeeklyChart data={weeklyData} color="blue" />
      </section>

      {/* Heatmap */}
      <section className="analytics-page__section">
        <h2 className="analytics-page__section-title">Activity</h2>
        <Heatmap data={heatmapData} color="green" />
      </section>

      {/* Habit Breakdown */}
      <section className="analytics-page__section">
        <h2 className="analytics-page__section-title">Habit Breakdown</h2>
        <div className="analytics-page__breakdown">
          {habits.map((habit) => {
            const rate = Math.round(Math.random() * 40 + 60); // Placeholder
            return (
              <div key={habit.id} className="analytics-page__habit-row">
                <span className="analytics-page__habit-name">{habit.name}</span>
                <div className="analytics-page__habit-bar-container">
                  <div 
                    className={`analytics-page__habit-bar analytics-page__habit-bar--${habit.color}`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
                <span className="analytics-page__habit-rate">{rate}%</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
