import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Calendar as CalendarIcon,
} from 'lucide-react';

export const Topbar: React.FC = () => {
  const {
    settings,
    profession,
    currentView,
    notifications,
    setIsGlobalSearchOpen,
    setIsAIAssistantOpen,
    setTheme,
    setCurrentView,
    setIsAuthenticated,
    showToast,
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const viewTitles: Record<string, string> = {
    dashboard: 'Business Overview',
    appointments: `${profession.appointmentLabel.plural} Schedule`,
    clients: `${profession.clientLabel.plural} Directory`,
    services: `${profession.serviceLabel.plural} & Pricing`,
    finance: 'Financial Operations',
    analytics: 'Performance & Intelligence',
    tasks: 'Tasks & Reminders',
    notifications: 'Notification Center',
    settings: 'Platform Settings',
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* Zone 1: Breadcrumb & View Label */}
      <div className="flex items-center gap-3">
        <div>
          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 hidden sm:inline">
            {settings.businessName}
          </span>
          <span className="text-xs font-medium text-neutral-300 dark:text-neutral-700 mx-2 hidden sm:inline">/</span>
          <h1 className="text-sm md:text-base font-semibold text-neutral-900 dark:text-white inline-block">
            {viewTitles[currentView] || 'Overview'}
          </h1>
        </div>
      </div>

      {/* Zone 2: Global Search Trigger */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700/80 rounded-xl transition-all w-36 sm:w-60 md:w-72 justify-between border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
            <span className="truncate">Search {profession.clientLabel.plural.toLowerCase()}, slots...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions (Date, Theme, AI Orb, Notifs, Profile) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 px-2.5 py-1 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
          <CalendarIcon className="w-3.5 h-3.5 text-neutral-400" />
          <span>{todayFormatted}</span>
        </div>

        {/* AI Orb Assistant Button */}
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="relative flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all cursor-pointer group shadow-xs"
          title="Open AI Administrator"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-indigo-400"></span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-semibold">AI Admin</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')}
          className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
          title={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-600" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-neutral-900" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl p-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                  Notifications ({unreadCount} new)
                </span>
                <button
                  onClick={() => {
                    setCurrentView('notifications');
                    setIsNotifOpen(false);
                  }}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  View all
                </button>
              </div>

              <div className="mt-2 divide-y divide-neutral-100 dark:divide-neutral-800 max-h-72 overflow-y-auto">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.actionTarget) setCurrentView(n.actionTarget as any);
                      setIsNotifOpen(false);
                    }}
                    className="py-2.5 px-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        {n.title}
                      </p>
                      <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile menu */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 sm:pr-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
              <img
                src="/src/assets/images/avatar_owner_aziz_1790573669256.jpg"
                alt={settings.ownerName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-xs">A</span>
            </div>
            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 hidden md:inline">
              {settings.ownerName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:inline" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl p-1.5 z-50 animate-in fade-in">
              <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                  {settings.ownerName}
                </p>
                <p className="text-[11px] text-neutral-400 capitalize">
                  {profession.name}
                </p>
              </div>

              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => {
                    setCurrentView('settings');
                    setIsProfileOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Settings & Profile</span>
                </button>
                <button
                  onClick={() => {
                    showToast('AI Admin User Guide & Docs loaded', 'info');
                    setIsProfileOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Help & Shortcuts</span>
                </button>
                <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />
                <button
                  onClick={() => {
                    setCurrentView('landing');
                    setIsProfileOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>View Public Landing</span>
                </button>
                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    setCurrentView('landing');
                    setIsProfileOpen(false);
                    showToast('Logged out of demo session', 'info');
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
