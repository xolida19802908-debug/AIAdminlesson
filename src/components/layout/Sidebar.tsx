import React, { useState } from 'react';
import { useApp, ViewType } from '../../context/AppContext';
import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  CheckSquare,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    profession,
    settings,
    notifications,
    tasks,
    setIsAIAssistantOpen,
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;

  const navItems: Array<{
    id: ViewType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    isAiTrigger?: boolean;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'appointments',
      label: profession.appointmentLabel.plural,
      icon: Calendar,
    },
    {
      id: 'clients',
      label: profession.clientLabel.plural,
      icon: Users,
    },
    {
      id: 'services',
      label: profession.serviceLabel.plural,
      icon: Briefcase,
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: DollarSign,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
    },
    {
      id: 'tasks',
      label: 'Tasks & Reminders',
      icon: CheckSquare,
      badge: pendingTasks > 0 ? pendingTasks : undefined,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifs > 0 ? unreadNotifs : undefined,
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col justify-between h-screen sticky top-0 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-200 z-40 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand & collapse trigger */}
      <div>
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-800">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white truncate">
                  AI ADMIN
                </span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate font-mono uppercase tracking-wider">
                  {profession.name}
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="mx-auto w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
              isCollapsed ? 'hidden' : 'block'
            }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* AI Assistant Fast Action Banner */}
        <div className="p-3">
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-indigo-500/5 hover:from-indigo-500/15 hover:to-violet-500/15 border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 transition-all cursor-pointer group ${
              isCollapsed ? 'justify-center p-2' : ''
            }`}
            title="Ask AI Admin"
          >
            <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 text-white shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            {!isCollapsed && (
              <div className="text-left flex-1 min-w-0">
                <div className="text-xs font-semibold leading-tight flex items-center justify-between">
                  <span>AI Assistant</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 font-mono text-indigo-600 dark:text-indigo-400">
                    Active
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  Ask anything or manage
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="px-2 space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`relative flex items-center w-full px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isCollapsed ? 'justify-center px-2' : 'justify-between'
                } ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-mono tabular-nums font-semibold">
                    {item.badge}
                  </span>
                )}

                {/* Collapsed dot for badge */}
                {isCollapsed && item.badge !== undefined && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: Settings, Expand button */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
        <button
          onClick={() => setCurrentView('settings')}
          title={isCollapsed ? 'Settings' : undefined}
          className={`flex items-center w-full px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
            isCollapsed ? 'justify-center px-2' : 'gap-3'
          } ${
            currentView === 'settings'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
          }`}
        >
          <Settings className="w-4 h-4 shrink-0 text-neutral-400" />
          {!isCollapsed && <span>Settings</span>}
        </button>

        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="flex items-center justify-center w-full p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {!isCollapsed && (
          <div className="pt-2 px-1 text-[11px] text-neutral-400 dark:text-neutral-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{settings.currency} Active</span>
            </span>
            <span className="font-mono text-[10px]">v2.4</span>
          </div>
        )}
      </div>
    </aside>
  );
};
