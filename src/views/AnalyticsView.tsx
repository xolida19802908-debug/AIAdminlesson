import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Users,
  Calendar,
  Sparkles,
  BarChart3,
  PieChart,
  Percent,
  CheckCircle,
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { RevenueAreaChart, AppointmentsBarChart, ServiceBreakdownDonut } from '../components/common/Charts';
import { formatCurrency } from '../utils/formatters';

export const AnalyticsView: React.FC = () => {
  const { settings, profession, clients, appointments } = useApp();

  const dayOfWeekData = [
    { label: 'Mon', value: 4 },
    { label: 'Tue', value: 3 },
    { label: 'Wed', value: 6 },
    { label: 'Thu', value: 7 },
    { label: 'Fri', value: 10 },
    { label: 'Sat', value: 12, highlight: true },
    { label: 'Sun', value: 5 },
  ];

  const revenueTrendData = [
    { label: 'Week 1', value: 1850000 },
    { label: 'Week 2', value: 2400000 },
    { label: 'Week 3', value: 2950000 },
    { label: 'Week 4', value: 3600000 },
  ];

  const serviceSlices = [
    { label: 'Combo Haircut & Beard', value: 4500000, color: '#6366f1' },
    { label: 'Classic Fades', value: 2400000, color: '#3b82f6' },
    { label: 'Beard Trims', value: 1100000, color: '#10b981' },
    { label: 'Facial & Shaves', value: 850000, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Performance & Intelligence
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Detailed metrics, client retention patterns, and AI-driven growth analysis.
        </p>
      </div>

      {/* Top 4 Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Returning Client Share"
          value="68%"
          change="+4.2%"
          isPositive={true}
          subtext="generates 68% revenue"
          icon={Users}
        />

        <StatCard
          label="Chair Utilization Peak"
          value="96%"
          change="Saturday Peak"
          isPositive={true}
          subtext="12 booked slots"
          icon={Calendar}
        />

        <StatCard
          label="Cancellation Rate"
          value="2.4%"
          change="-0.8%"
          isPositive={true}
          subtext="extremely low"
          icon={CheckCircle}
        />

        <StatCard
          label="No-Show Rate"
          value="1.1%"
          change="Only 1 client"
          isPositive={true}
          subtext="reliable base"
          icon={Percent}
        />
      </div>

      {/* AI Intelligence Insights Highlight */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-indigo-950/30 to-violet-950/30 border border-indigo-200/40 dark:border-indigo-800/40 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            AI Automated Performance Summary
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/50 dark:border-neutral-800/60">
            <span className="text-[11px] font-semibold text-neutral-500">Busiest Day</span>
            <p className="text-xs font-bold text-neutral-900 dark:text-white mt-1">
              Saturday is your highest earning day
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">
              Averages 12 appointments with 96% chair utilization.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/50 dark:border-neutral-800/60">
            <span className="text-[11px] font-semibold text-neutral-500">Top Service</span>
            <p className="text-xs font-bold text-neutral-900 dark:text-white mt-1">
              Haircut + Beard Styling Combo
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">
              Accounts for 51% of gross revenue and highest client satisfaction.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/50 dark:border-neutral-800/60">
            <span className="text-[11px] font-semibold text-neutral-500">Client Retention</span>
            <p className="text-xs font-bold text-neutral-900 dark:text-white mt-1">
              Returning regulars generate 68%
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">
              Focusing on keeping existing regulars boosts monthly earnings substantially.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments by Day of Week Bar Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Bookings by Day of Week
              </h3>
              <p className="text-xs text-neutral-500">
                Peak load occurs on Saturday and Friday afternoons
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-1 rounded-lg">
              Sat Peak (12)
            </span>
          </div>

          <AppointmentsBarChart data={dayOfWeekData} height={200} />
        </div>

        {/* Weekly Revenue Trend Area Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Weekly Revenue Progression
              </h3>
              <p className="text-xs text-neutral-500">
                Continuous month-over-month growth trajectory
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg">
              +14.2% MoM
            </span>
          </div>

          <RevenueAreaChart data={revenueTrendData} currency={settings.currency} height={200} />
        </div>
      </div>

      {/* Service Breakdown */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Revenue Share by Service Category
          </h3>
          <p className="text-xs text-neutral-500">
            How different treatments and services contribute to the business balance sheet
          </p>
        </div>

        <ServiceBreakdownDonut slices={serviceSlices} currency={settings.currency} />
      </div>
    </div>
  );
};
