import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSettingsStore } from './stores/settingsStore';
import { useHabitStore } from './stores/habitStore';
import { AppShell } from './components/layout/AppShell';
import { TodayPage } from './pages/TodayPage';
import { HabitsPage } from './pages/HabitsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const fetchSettings = useSettingsStore(state => state.fetchSettings);
  const fetchHabits = useHabitStore(state => state.fetchHabits);

  useEffect(() => {
    // Initialize app data
    fetchSettings();
    fetchHabits();
  }, [fetchSettings, fetchHabits]);

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<TodayPage />} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
