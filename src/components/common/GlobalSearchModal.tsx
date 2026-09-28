import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  CheckSquare,
  Sparkles,
  Sun,
  Moon,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface GlobalSearchModalProps {
  onOpenAddClient?: () => void;
  onOpenAddAppointment?: () => void;
  onOpenAddTransaction?: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  onOpenAddClient,
  onOpenAddAppointment,
  onOpenAddTransaction,
}) => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    clients,
    appointments,
    services,
    transactions,
    tasks,
    setCurrentView,
    setSelectedClientId,
    settings,
    setTheme,
    setIsAIAssistantOpen,
    profession,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(!isGlobalSearchOpen);
      } else if (e.key === 'Escape' && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  useEffect(() => {
    if (isGlobalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Filtered categorized results
  const filteredClients = trimmed
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.phone.toLowerCase().includes(trimmed) ||
          c.notes.toLowerCase().includes(trimmed)
      ).slice(0, 4)
    : [];

  const filteredAppointments = trimmed
    ? appointments.filter(
        (a) =>
          a.clientName.toLowerCase().includes(trimmed) ||
          a.serviceName.toLowerCase().includes(trimmed) ||
          a.date.includes(trimmed)
      ).slice(0, 4)
    : [];

  const filteredServices = trimmed
    ? services.filter(
        (s) =>
          s.name.toLowerCase().includes(trimmed) ||
          s.category.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const filteredTransactions = trimmed
    ? transactions.filter(
        (t) =>
          t.description.toLowerCase().includes(trimmed) ||
          t.category.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const filteredTasks = trimmed
    ? tasks.filter((t) => t.title.toLowerCase().includes(trimmed)).slice(0, 3)
    : [];

  const hasResults =
    filteredClients.length > 0 ||
    filteredAppointments.length > 0 ||
    filteredServices.length > 0 ||
    filteredTransactions.length > 0 ||
    filteredTasks.length > 0;

  const quickCommands = [
    {
      label: `Add New ${profession.clientLabel.singular}`,
      icon: Users,
      action: () => {
        setIsGlobalSearchOpen(false);
        if (onOpenAddClient) onOpenAddClient();
        else setCurrentView('clients');
      },
    },
    {
      label: `Create ${profession.appointmentLabel.singular}`,
      icon: Calendar,
      action: () => {
        setIsGlobalSearchOpen(false);
        if (onOpenAddAppointment) onOpenAddAppointment();
        else setCurrentView('appointments');
      },
    },
    {
      label: 'Record Transaction',
      icon: DollarSign,
      action: () => {
        setIsGlobalSearchOpen(false);
        if (onOpenAddTransaction) onOpenAddTransaction();
        else setCurrentView('finance');
      },
    },
    {
      label: 'Ask AI Administrator',
      icon: Sparkles,
      action: () => {
        setIsGlobalSearchOpen(false);
        setIsAIAssistantOpen(true);
      },
    },
    {
      label: `Toggle Dark / Light Mode`,
      icon: settings.theme === 'dark' ? Sun : Moon,
      action: () => {
        setTheme(settings.theme === 'dark' ? 'light' : 'dark');
        setIsGlobalSearchOpen(false);
      },
    },
    {
      label: 'Open Platform Settings',
      icon: Settings,
      action: () => {
        setIsGlobalSearchOpen(false);
        setCurrentView('settings');
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 overflow-y-auto">
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsGlobalSearchOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden z-10 animate-in fade-in">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${profession.clientLabel.plural.toLowerCase()}, appointments, services, transactions...`}
            className="w-full bg-transparent text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Content Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Query Results */}
          {trimmed && (
            <>
              {!hasResults && (
                <div className="py-8 text-center text-xs text-neutral-400">
                  No matching records found for "{query}". Try another query.
                </div>
              )}

              {/* Clients */}
              {filteredClients.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 mb-1">
                    {profession.clientLabel.plural}
                  </div>
                  <div className="space-y-1">
                    {filteredClients.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedClientId(c.id);
                          setCurrentView('clients');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-indigo-500" />
                          <div>
                            <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                              {c.name}
                            </p>
                            <p className="text-[11px] text-neutral-500 font-mono">
                              {c.phone}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-400">
                          {c.totalVisits} visits
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appointments */}
              {filteredAppointments.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 mb-1">
                    {profession.appointmentLabel.plural}
                  </div>
                  <div className="space-y-1">
                    {filteredAppointments.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          setCurrentView('appointments');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Calendar className="w-4 h-4 text-emerald-500" />
                          <div>
                            <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                              {a.clientName} — {a.serviceName}
                            </p>
                            <p className="text-[11px] text-neutral-500 font-mono">
                              {a.date} · {a.startTime} – {a.endTime}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 capitalize">
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {filteredServices.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 mb-1">
                    {profession.serviceLabel.plural}
                  </div>
                  <div className="space-y-1">
                    {filteredServices.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setCurrentView('services');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Briefcase className="w-4 h-4 text-purple-500" />
                          <div>
                            <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                              {s.name}
                            </p>
                            <p className="text-[11px] text-neutral-500">
                              {s.durationMinutes} min · {s.category}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-medium text-neutral-800 dark:text-neutral-200">
                          {formatCurrency(s.price, settings.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transactions */}
              {filteredTransactions.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 mb-1">
                    Finance Transactions
                  </div>
                  <div className="space-y-1">
                    {filteredTransactions.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setCurrentView('finance');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <DollarSign className="w-4 h-4 text-amber-500" />
                          <div>
                            <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                              {t.description}
                            </p>
                            <p className="text-[11px] text-neutral-500 font-mono">
                              {t.date} · {t.category}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-mono font-semibold ${
                            t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {t.type === 'income' ? '+' : '-'}
                          {formatCurrency(t.amount, settings.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Quick Commands & Navigation */}
          {!trimmed && (
            <div>
              <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 mb-1">
                Quick Commands
              </div>
              <div className="space-y-1">
                {quickCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={idx}
                      onClick={cmd.action}
                      className="flex items-center justify-between w-full p-2.5 rounded-xl text-left hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 group-hover:text-indigo-600">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{cmd.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500">
          <span>Navigate with mouse or keyboard</span>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span>[ESC] Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
