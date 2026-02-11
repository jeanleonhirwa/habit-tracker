import { create } from 'zustand';
import { db, getSettings, updateSettings as dbUpdateSettings } from '../db/database';
import { Settings, defaultSettings, ThemeMode } from '../types/settings';

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  
  // Actions
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  setTheme: (theme: ThemeMode) => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

// Apply theme to document
function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const settings = useSettingsStore.getState().settings;
    if (settings.theme === 'system') {
      applyTheme('system');
    }
  });
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  isLoading: false,

  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const settings = await getSettings();
      set({ settings, isLoading: false });
      applyTheme(settings.theme);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      set({ isLoading: false });
    }
  },

  updateSettings: async (updates) => {
    const currentSettings = get().settings;
    const newSettings = { ...currentSettings, ...updates };
    
    await dbUpdateSettings(updates);
    set({ settings: newSettings });
    
    if (updates.theme) {
      applyTheme(updates.theme);
    }
  },

  resetSettings: async () => {
    await db.settings.put(defaultSettings);
    set({ settings: defaultSettings });
    applyTheme(defaultSettings.theme);
  },

  setTheme: (theme) => {
    get().updateSettings({ theme });
  },

  getEffectiveTheme: () => {
    const { theme } = get().settings;
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  },
}));
