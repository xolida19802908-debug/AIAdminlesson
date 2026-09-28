import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROFESSIONS } from '../data/professions';
import {
  User,
  Building,
  Briefcase,
  Clock,
  DollarSign,
  Globe,
  Palette,
  Sparkles,
  Shield,
  RotateCcw,
  Check,
} from 'lucide-react';
import { CurrencyCode, LanguageCode, ProfessionId, ThemeMode } from '../types';

export const SettingsView: React.FC = () => {
  const {
    settings,
    profession,
    updateSettings,
    setProfession,
    setTheme,
    setCurrency,
    setLanguage,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'profession' | 'schedule' | 'ai' | 'security'>('general');

  // Form states
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [workingStart, setWorkingStart] = useState(settings.workingHoursStart);
  const [workingEnd, setWorkingEnd] = useState(settings.workingHoursEnd);
  const [workingDays, setWorkingDays] = useState<string[]>(settings.workingDays);
  const [aiTone, setAiTone] = useState(settings.aiTone);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ownerName,
      businessName,
    });
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      workingHoursStart: workingStart,
      workingHoursEnd: workingEnd,
      workingDays,
    });
  };

  const handleSaveAI = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ aiTone });
  };

  const handleResetDemoData = () => {
    if (confirm('Reset all demo data back to default AZ Studio barber state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Platform Settings
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Customize your profession adapter, working schedule, regional currency, and AI behavior.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1">
          {[
            { id: 'general', label: 'General & Profile', icon: User },
            { id: 'profession', label: 'Profession Adapter', icon: Briefcase },
            { id: 'schedule', label: 'Working Schedule', icon: Clock },
            { id: 'ai', label: 'AI Intelligence', icon: Sparkles },
            { id: 'security', label: 'Data & Security', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-3 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          {/* GENERAL & PROFILE */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Business & Profile Details
                </h3>
                <p className="text-xs text-neutral-500">
                  Update business name, owner identity, and regional localization.
                </p>
              </div>

              <form onSubmit={handleSaveGeneral} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Business / Studio Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Currency selector */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Currency
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['UZS', 'USD', 'EUR', 'RUB'] as CurrencyCode[]).map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setCurrency(c)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                          settings.currency === c
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language selector */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Interface Language
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { code: 'uz', label: "O'zbekcha" },
                      { code: 'en', label: 'English' },
                      { code: 'ru', label: 'Русский' },
                    ].map((l) => (
                      <button
                        type="button"
                        key={l.code}
                        onClick={() => setLanguage(l.code as LanguageCode)}
                        className={`py-2 px-3 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                          settings.language === l.code
                            ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                            : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Appearance Theme Selector */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Theme Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setTheme(m)}
                        className={`py-2 px-3 text-xs font-medium capitalize rounded-xl border transition-colors cursor-pointer ${
                          settings.theme === m
                            ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                            : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
                >
                  Save General Settings
                </button>
              </form>
            </div>
          )}

          {/* PROFESSION ADAPTER */}
          {activeTab === 'profession' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Universal Profession Adapter
                </h3>
                <p className="text-xs text-neutral-500">
                  Select your profession. The platform dynamically recalibrates all terminology, default services, metrics, and workflows.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.values(PROFESSIONS).map((prof) => {
                  const isCurrent = settings.profession === prof.id;

                  return (
                    <div
                      key={prof.id}
                      onClick={() => setProfession(prof.id, true)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/30'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white">
                            {prof.name}
                          </span>
                          {isCurrent && (
                            <span className="p-1 rounded-full bg-indigo-600 text-white">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                          {prof.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50 text-[10px] text-neutral-400 font-mono">
                        Terminology: {prof.clientLabel.plural} · {prof.appointmentLabel.plural} · {prof.serviceLabel.plural}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Working Hours & Availability
                </h3>
                <p className="text-xs text-neutral-500">
                  Define your calendar availability for appointment slots.
                </p>
              </div>

              <form onSubmit={handleSaveSchedule} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Active Working Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => {
                      const isSelected = workingDays.includes(day);
                      return (
                        <button
                          type="button"
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Day Opening Time
                    </label>
                    <input
                      type="time"
                      value={workingStart}
                      onChange={(e) => setWorkingStart(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Day Closing Time
                    </label>
                    <input
                      type="time"
                      value={workingEnd}
                      onChange={(e) => setWorkingEnd(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
                >
                  Save Schedule
                </button>
              </form>
            </div>
          )}

          {/* AI PREFERENCES */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  AI Administrator Behavior
                </h3>
                <p className="text-xs text-neutral-500">
                  Control how proactive your virtual administrator communicates.
                </p>
              </div>

              <form onSubmit={handleSaveAI} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    AI Communication Tone
                  </label>
                  <div className="space-y-2">
                    {[
                      {
                        id: 'proactive',
                        title: 'Proactive & Strategic (Recommended)',
                        desc: 'Alerts on empty slots, inactive clients >30d, unconfirmed appointments, and revenue trends.',
                      },
                      {
                        id: 'concise',
                        title: 'Concise & Direct',
                        desc: 'Short answers focused strictly on immediate facts and numbers.',
                      },
                      {
                        id: 'detailed',
                        title: 'Comprehensive & Advisory',
                        desc: 'In-depth business management advice and strategic tips.',
                      },
                    ].map((tone) => (
                      <div
                        key={tone.id}
                        onClick={() => setAiTone(tone.id as any)}
                        className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                          aiTone === tone.id
                            ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/30'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                        }`}
                      >
                        <p className="text-xs font-bold text-neutral-900 dark:text-white">
                          {tone.title}
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {tone.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
                >
                  Save AI Preferences
                </button>
              </form>
            </div>
          )}

          {/* SECURITY & DATA */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Data Architecture & Demo State
                </h3>
                <p className="text-xs text-neutral-500">
                  Manage persistence and data reset options.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                  Backend & Database Readiness
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  This system operates with a fully typed service abstraction layer (`aiService`, `AppContext`). It stores state persistently in browser storage and is architected to connect directly to Firebase Firestore, PostgreSQL/Cloud SQL, or a REST backend without modifying UI contracts.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20 space-y-3">
                <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400">
                  Reset Demo State
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Restore original 16 clients, 8 today appointments, transactions, and "AZ Studio" barber state.
                </p>
                <button
                  type="button"
                  onClick={handleResetDemoData}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Demo Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
