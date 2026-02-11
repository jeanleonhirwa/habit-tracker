import React, { useState } from 'react';
import { Moon, Sun, Monitor, Download, Upload, Trash2, Info } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { Switch, Button, CardGroup } from '../components/ui';
import { db } from '../db/database';
import { ThemeMode } from '../types/settings';
import './SettingsPage.css';

export function SettingsPage() {
  const { settings, updateSettings } = useSettingsStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleThemeChange = (theme: ThemeMode) => {
    updateSettings({ theme });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const habits = await db.habits.toArray();
      const completions = await db.completions.toArray();
      
      const data = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        habits,
        completions,
        settings,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `habitflow-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      updateSettings({ lastBackupDate: new Date() });
    } catch (error) {
      alert('Failed to export data');
    }
    setIsExporting(false);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.habits || !data.completions) {
        throw new Error('Invalid backup file');
      }

      if (!confirm('This will replace all your current data. Are you sure?')) {
        setIsImporting(false);
        return;
      }

      await db.transaction('rw', [db.habits, db.completions], async () => {
        await db.habits.clear();
        await db.completions.clear();
        await db.habits.bulkAdd(data.habits);
        await db.completions.bulkAdd(data.completions);
      });

      window.location.reload();
    } catch (error) {
      alert('Failed to import data. Make sure the file is a valid backup.');
    }
    setIsImporting(false);
    event.target.value = '';
  };

  const handleClearData = async () => {
    if (!confirm('Are you sure you want to delete ALL your data? This cannot be undone!')) {
      return;
    }
    
    if (!confirm('This is your last chance. All habits and history will be permanently deleted.')) {
      return;
    }

    await db.transaction('rw', [db.habits, db.completions], async () => {
      await db.habits.clear();
      await db.completions.clear();
    });

    window.location.reload();
  };

  return (
    <div className="page settings-page">
      {/* Header */}
      <header className="page__header">
        <h1 className="page__title">Settings</h1>
        <p className="page__subtitle">Customize your experience</p>
      </header>

      {/* Appearance */}
      <section className="settings-page__section">
        <h2 className="settings-page__section-title">Appearance</h2>
        <CardGroup>
          <div className="settings-page__theme-options">
            <button
              className={`settings-page__theme-btn ${settings.theme === 'light' ? 'settings-page__theme-btn--active' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              <Sun size={24} />
              <span>Light</span>
            </button>
            <button
              className={`settings-page__theme-btn ${settings.theme === 'dark' ? 'settings-page__theme-btn--active' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              <Moon size={24} />
              <span>Dark</span>
            </button>
            <button
              className={`settings-page__theme-btn ${settings.theme === 'system' ? 'settings-page__theme-btn--active' : ''}`}
              onClick={() => handleThemeChange('system')}
            >
              <Monitor size={24} />
              <span>System</span>
            </button>
          </div>
        </CardGroup>
      </section>

      {/* Preferences */}
      <section className="settings-page__section">
        <h2 className="settings-page__section-title">Preferences</h2>
        <CardGroup>
          <div className="settings-page__row">
            <div className="settings-page__row-content">
              <span className="settings-page__row-label">Week starts on Monday</span>
            </div>
            <Switch
              checked={settings.weekStartsOn === 1}
              onChange={(checked) => updateSettings({ weekStartsOn: checked ? 1 : 0 })}
            />
          </div>
          <div className="settings-page__row">
            <div className="settings-page__row-content">
              <span className="settings-page__row-label">Streak animations</span>
              <span className="settings-page__row-desc">Show celebration animations</span>
            </div>
            <Switch
              checked={settings.showStreakAnimation}
              onChange={(checked) => updateSettings({ showStreakAnimation: checked })}
            />
          </div>
          <div className="settings-page__row">
            <div className="settings-page__row-content">
              <span className="settings-page__row-label">Sound effects</span>
            </div>
            <Switch
              checked={settings.enableSounds}
              onChange={(checked) => updateSettings({ enableSounds: checked })}
            />
          </div>
        </CardGroup>
      </section>

      {/* Data */}
      <section className="settings-page__section">
        <h2 className="settings-page__section-title">Data</h2>
        <CardGroup>
          <button className="settings-page__row settings-page__row--clickable" onClick={handleExport} disabled={isExporting}>
            <div className="settings-page__row-icon settings-page__row-icon--blue">
              <Download size={20} />
            </div>
            <div className="settings-page__row-content">
              <span className="settings-page__row-label">Export Data</span>
              <span className="settings-page__row-desc">
                {settings.lastBackupDate 
                  ? `Last backup: ${new Date(settings.lastBackupDate).toLocaleDateString()}`
                  : 'Download your data as JSON'
                }
              </span>
            </div>
          </button>
          
          <label className="settings-page__row settings-page__row--clickable">
            <div className="settings-page__row-icon settings-page__row-icon--green">
              <Upload size={20} />
            </div>
            <div className="settings-page__row-content">
              <span className="settings-page__row-label">Import Data</span>
              <span className="settings-page__row-desc">Restore from backup file</span>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="settings-page__file-input"
              disabled={isImporting}
            />
          </label>
          
          <button className="settings-page__row settings-page__row--clickable settings-page__row--danger" onClick={handleClearData}>
            <div className="settings-page__row-icon settings-page__row-icon--red">
              <Trash2 size={20} />
            </div>
            <div className="settings-page__row-content">
              <span className="settings-page__row-label settings-page__row-label--danger">Clear All Data</span>
              <span className="settings-page__row-desc">Permanently delete everything</span>
            </div>
          </button>
        </CardGroup>
      </section>

      {/* About */}
      <section className="settings-page__section">
        <h2 className="settings-page__section-title">About</h2>
        <CardGroup>
          <div className="settings-page__row">
            <div className="settings-page__row-icon settings-page__row-icon--gray">
              <Info size={20} />
            </div>
            <div className="settings-page__row-content">
              <span className="settings-page__row-label">HabitFlow</span>
              <span className="settings-page__row-desc">Version 1.0.0</span>
            </div>
          </div>
        </CardGroup>
      </section>

      {/* Footer */}
      <footer className="settings-page__footer">
        <p>Made with ❤️ for better habits</p>
        <p>All data stored locally on your device</p>
      </footer>
    </div>
  );
}
