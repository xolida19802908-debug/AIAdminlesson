import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { AIInsightCard } from '../components/ai/AIInsightCard';
import {
  Calendar,
  Users,
  DollarSign,
  AlertCircle,
  Plus,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { todayStr, tomorrowStr } from '../data/initialData';

interface DashboardViewProps {
  onOpenAddAppointment: () => void;
  onOpenAddClient: () => void;
  onOpenAddTransaction: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddAppointment,
  onOpenAddClient,
  onOpenAddTransaction,
}) => {
  const {
    settings,
    profession,
    clients,
    appointments,
    transactions,
    insights,
    dismissInsight,
    updateAppointmentStatus,
    updatePaymentStatus,
    setSelectedClientId,
    setCurrentView,
    setIsAIAssistantOpen,
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'pending' | 'confirmed'>('all');

  // Today's appointments
  const todayApts = appointments.filter((a) => a.date === todayStr);
  const pendingCount = todayApts.filter((a) => a.status === 'pending').length;
  const confirmedCount = todayApts.filter((a) => a.status === 'confirmed').length;

  // Expected revenue from today's scheduled slots
  const todayExpectedRevenue = todayApts.reduce((sum, a) => sum + a.price, 0);

  // Outstanding balances across all clients
  const totalOutstanding = clients.reduce((sum, c) => sum + c.outstandingBalance, 0);
  const debtorsCount = clients.filter((c) => c.outstandingBalance > 0).length;

  const filteredTodayApts = todayApts.filter((a) => {
    if (activeTabFilter === 'all') return true;
    return a.status === activeTabFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            Pending
          </span>
        );
      case 'completed':
        return (
          <span className="text-[11px] font-semibold text-neutral-500">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-[11px] font-semibold text-rose-500">
            Cancelled
          </span>
        );
      default:
        return <span className="text-[11px] text-neutral-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Good morning, {settings.ownerName} 👋
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Here's what's happening with your business today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:bg-indigo-100 transition-colors shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Briefing</span>
          </button>

          <button
            onClick={onOpenAddAppointment}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New {profession.appointmentLabel.singular}</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Revenue (Expected)"
          value={formatCurrency(todayExpectedRevenue, settings.currency)}
          change="+12.4%"
          isPositive={true}
          subtext="vs last month"
          icon={DollarSign}
          onClick={() => setCurrentView('finance')}
        />

        <StatCard
          label={`Today's ${profession.appointmentLabel.plural}`}
          value={`${todayApts.length}`}
          change={`${confirmedCount} confirmed`}
          isPositive={true}
          badgeText={pendingCount > 0 ? `${pendingCount} pending` : undefined}
          icon={Calendar}
          onClick={() => setCurrentView('appointments')}
        />

        <StatCard
          label={`Active ${profession.clientLabel.plural}`}
          value={`${clients.length}`}
          change="+8 this month"
          isPositive={true}
          subtext="total registered"
          icon={Users}
          onClick={() => setCurrentView('clients')}
        />

        <StatCard
          label="Outstanding Balances"
          value={formatCurrency(totalOutstanding, settings.currency)}
          change={`${debtorsCount} ${profession.clientLabel.plural.toLowerCase()}`}
          isPositive={false}
          subtext="pending collection"
          icon={AlertCircle}
          onClick={() => {
            setCurrentView('clients');
          }}
        />
      </div>

      {/* Main Grid: Schedule Timeline & AI Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Schedule Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Today's Schedule
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {todayApts.length} bookings scheduled for today ({todayStr})
                  </p>
                </div>
              </div>

              {/* Segmented Filter Control */}
              <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                <button
                  onClick={() => setActiveTabFilter('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTabFilter === 'all'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
                  }`}
                >
                  All ({todayApts.length})
                </button>
                <button
                  onClick={() => setActiveTabFilter('pending')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTabFilter === 'pending'
                      ? 'bg-white dark:bg-neutral-900 text-amber-600 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setActiveTabFilter('confirmed')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTabFilter === 'confirmed'
                      ? 'bg-white dark:bg-neutral-900 text-emerald-600 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
                  }`}
                >
                  Confirmed ({confirmedCount})
                </button>
              </div>
            </div>

            {/* Appointment Timeline List */}
            <div className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredTodayApts.length === 0 ? (
                <div className="py-12 text-center">
                  <Calendar className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
                  <p className="text-xs text-neutral-500">
                    No appointments in this category for today.
                  </p>
                </div>
              ) : (
                filteredTodayApts.map((apt) => (
                  <div
                    key={apt.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 px-2 rounded-xl transition-colors"
                  >
                    {/* Time & Client details */}
                    <div className="flex items-start gap-3.5">
                      <div className="text-center shrink-0 w-16 pt-0.5">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white font-mono block">
                          {apt.startTime}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {apt.endTime}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedClientId(apt.clientId);
                              setCurrentView('clients');
                            }}
                            className="text-xs font-bold text-neutral-900 dark:text-white hover:text-indigo-600 hover:underline cursor-pointer text-left"
                          >
                            {apt.clientName}
                          </button>
                          <span aria-hidden="true" className="text-neutral-300">·</span>
                          {getStatusBadge(apt.status)}
                        </div>

                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          {apt.serviceName}
                        </div>

                        {apt.notes && (
                          <p className="text-[11px] text-neutral-400 italic line-clamp-1">
                            "{apt.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price, Payment Status & Quick actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-16 sm:pl-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white font-mono tabular-nums block">
                          {formatCurrency(apt.price, settings.currency)}
                        </span>
                        <span
                          className={`text-[10px] font-semibold cursor-pointer ${
                            apt.paymentStatus === 'paid'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400 underline'
                          }`}
                          onClick={() =>
                            updatePaymentStatus(
                              apt.id,
                              apt.paymentStatus === 'paid' ? 'unpaid' : 'paid'
                            )
                          }
                          title="Click to toggle payment"
                        >
                          {apt.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>

                      {/* Interactive Action Buttons */}
                      <div className="flex items-center gap-1">
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                            className="px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                            title="Confirm appointment"
                          >
                            Confirm
                          </button>
                        )}

                        {apt.status !== 'completed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            className="p-1.5 text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                            title="Mark completed"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {apt.status !== 'cancelled' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                            title="Cancel appointment"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-500">
                Tomorrow has an open slot at <strong className="text-indigo-600">14:00</strong>
              </span>
              <button
                onClick={() => setCurrentView('appointments')}
                className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>Full Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: AI Insights & Proactive Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                AI Proactive Insights
              </h3>
            </div>

            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
            >
              Ask AI
            </button>
          </div>

          <div className="space-y-3">
            {insights.map((insight) => (
              <AIInsightCard
                key={insight.id}
                insight={insight}
                onDismiss={() => dismissInsight(insight.id)}
              />
            ))}
          </div>

          {/* Business Health Quick Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-indigo-950 text-white border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
                Monthly Performance
              </span>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                +14.2%
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Aziz Karimov is your top client this month. Returning clients represent 68% of your revenue.
            </p>

            <button
              onClick={() => setCurrentView('analytics')}
              className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
