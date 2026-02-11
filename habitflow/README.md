# HabitFlow 🌱

A beautiful, professional habit tracking web application inspired by Apple's Human Interface Guidelines. Built with React, TypeScript, and vanilla CSS for a clean, native-like experience.

![HabitFlow](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- **Apple-Inspired Design**: Clean, professional UI following Apple HIG principles
- **Offline-First**: Works without internet connection, data stored locally in IndexedDB
- **PWA Support**: Install as a native app on mobile and desktop
- **Rich Analytics**: Visualize your progress with charts, heatmaps, and statistics
- **Dark Mode**: Automatic or manual light/dark theme switching
- **Data Export/Import**: Backup and restore your data anytime

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
cd habitflow

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Vanilla CSS | Styling (Apple HIG-inspired) |
| Dexie.js | IndexedDB Wrapper |
| Zustand | State Management |
| Recharts | Charts & Visualizations |
| Lucide React | Icons |
| Framer Motion | Animations |
| vite-plugin-pwa | PWA & Service Worker |

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Base UI components (Button, Card, Sheet, etc.)
│   ├── habits/       # Habit-specific components
│   ├── analytics/    # Charts and statistics components
│   └── layout/       # App shell and navigation
├── pages/            # Main app pages
├── stores/           # Zustand state stores
├── db/               # IndexedDB database setup
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
└── styles/           # Global styles and design tokens
```

## 🎨 Design System

The app follows Apple's Human Interface Guidelines:

- **Typography**: System font stack (SF Pro approximation)
- **Colors**: Semantic colors that adapt to light/dark mode
- **Spacing**: 8pt grid system
- **Touch Targets**: Minimum 44x44px for accessibility
- **Animations**: Spring-based physics for natural motion
- **Materials**: Glassmorphism effects for depth

## 📱 Pages

1. **Today**: Daily habit tracking with progress ring
2. **Habits**: Manage all habits (create, edit, archive)
3. **Analytics**: Performance insights with charts and heatmaps
4. **Settings**: Theme, preferences, and data management

## 💾 Data Storage

All data is stored locally in your browser using IndexedDB:

- **Habits**: Name, icon, color, frequency, targets
- **Completions**: Daily completion records
- **Settings**: User preferences

No data is ever sent to external servers.

## 🔧 Configuration

### Environment Variables

No environment variables required - the app is fully client-side.

### PWA Configuration

The PWA manifest and service worker are configured in `vite.config.ts`.

## 📊 Analytics Features

- **Streak Tracking**: Current and longest streaks
- **Completion Rate**: Percentage of targets met
- **Weekly Chart**: Bar chart of last 7 days
- **Heatmap**: GitHub-style contribution graph
- **Habit Breakdown**: Per-habit performance comparison

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Full keyboard navigation
- Screen reader support
- Respects `prefers-reduced-motion`
- High contrast mode support

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

Made with ❤️ for better habits
