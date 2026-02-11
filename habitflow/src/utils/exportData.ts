import { db } from '../db/database';
import { Habit, Completion } from '../types/habit';
import { Settings } from '../types/settings';

interface ExportData {
  version: string;
  exportedAt: string;
  habits: Habit[];
  completions: Completion[];
  settings: Settings;
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function exportAsJSON(): Promise<Blob> {
  const habits = await db.habits.toArray();
  const completions = await db.completions.toArray();
  const settings = await db.settings.get('user_settings');

  const data: ExportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    habits,
    completions,
    settings: settings!,
  };

  return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
}

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

export async function importFromJSON(file: File): Promise<void> {
  const text = await file.text();
  const data: ExportData = JSON.parse(text);

  if (!data.version || !data.habits) {
    throw new Error('Invalid backup file format');
  }

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

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
