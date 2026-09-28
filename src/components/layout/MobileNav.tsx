import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Sparkles,
  Menu,
  X,
  DollarSign,
  TrendingUp,
  CheckSquare,
  Bell,
  Settings,
  Briefcase,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    profession,
    setIsAIAssistantOpen,
    notifications,
  } = useApp();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 px-2 py-1 flex items-center justify-around h-16 safe-bottom">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-colors ${
            currentView === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => setCurrentView('appointments')}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-colors ${
            currentView === 'appointments'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{profession.appointmentLabel.singular.slice(0, 7)}</span>
        </button>

        {/* Center AI Orb Button */}
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="relative -top-2 flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 active:scale-95 transition-transform"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-0.5">AI</span>
        </button>

        <button
          onClick={() => setCurrentView('clients')}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-colors ${
            currentView === 'clients'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{profession.clientLabel.plural.slice(0, 7)}</span>
        </button>

        <button
          onClick={() => setIsMoreMenuOpen(true)}
          className={`relative flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-colors ${
            isMoreMenuOpen
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">More</span>
          {unreadNotifs > 0 && (
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-indigo-600 rounded-full" />
          )}
        </button>
      </nav>

      {/* "More" Drawer for Mobile */}
      {isMoreMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
            onClick={() => setIsMoreMenuOpen(false)}
          />

          <div className="relative bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 rounded-t-3xl p-5 z-10 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                All Sections
              </span>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => {
                  setCurrentView('services');
                  setIsMoreMenuOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-left"
              >
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  {profession.serviceLabel.plural}
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('finance');
                  setIsMoreMenuOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-left"
              >
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  Finance
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('analytics');
                  setIsMoreMenuOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-left"
              >
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  Analytics
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('tasks');
                  setIsMoreMenuOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-left"
              >
                <CheckSquare className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  Tasks & Reminders
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('notifications');
                  setIsMoreMenuOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-left"
              >
                <Bell className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  Notifications ({unreadNotifs})
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('settings');
                  setIsMoreMenuOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-left"
              >
                <Settings className="w-4 h-4 text-neutral-600" />
                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  Settings
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
