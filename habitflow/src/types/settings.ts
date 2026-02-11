export type ThemeMode = 'light' | 'dark' | 'system';

export interface Settings {
  id: string;
  theme: ThemeMode;
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  showStreakAnimation: boolean;
  enableSounds: boolean;
  defaultReminderTime: string;
  dataExportFormat: 'json' | 'csv';
  lastBackupDate?: Date;
}

export const defaultSettings: Settings = {
  id: 'user_settings',
  theme: 'system',
  weekStartsOn: 1,
  showStreakAnimation: true,
  enableSounds: true,
  defaultReminderTime: '09:00',
  dataExportFormat: 'json',
};
