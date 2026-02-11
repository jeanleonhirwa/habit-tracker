import React from 'react';
import { TabBar } from './TabBar';
import './AppShell.css';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <main className="app-shell__content">
        {children}
      </main>
      <TabBar />
    </div>
  );
}
