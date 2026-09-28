import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Plus,
  Filter,
  Trash2,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { RevenueAreaChart, ServiceBreakdownDonut } from '../components/common/Charts';

interface FinanceViewProps {
  onOpenAddTransaction: () => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  onOpenAddTransaction,
}) => {
  const {
    transactions,
    clients,
    services,
    settings,
    deleteTransaction,
  } = useApp();

  const [timeFilter, setTimeFilter] = useState<'today' | '7d' | '30d' | 'year'>('30d');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const totalOutstanding = clients.reduce((sum, c) => sum + c.outstandingBalance, 0);

  const filteredTransactions = transactions.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    return true;
  });

  // Chart data for revenue curve
  const chartPoints = [
    { label: 'Sep 1', value: 390000 },
    { label: 'Sep 5', value: 480000 },
    { label: 'Sep 10', value: 460000 },
    { label: 'Sep 15', value: 690000 },
    { label: 'Sep 20', value: 580000 },
    { label: 'Sep 24', value: 710000 },
    { label: 'Yesterday', value: 450000 },
    { label: 'Today', value: 720000 },
  ];

  // Slices for service breakdown
  const donutSlices = [
    { label: 'Haircut + Beard', value: 3400000, color: '#6366f1' },
    { label: 'Classic Fade', value: 2100000, color: '#3b82f6' },
    { label: 'Executive Packages', value: 1250000, color: '#8b5cf6' },
    { label: 'Beard Trims & Shaves', value: 850000, color: '#10b981' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Finance & Ledger
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Track business revenue, operating overhead, net margins, and pending debts.
          </p>
        </div>

        <button
          onClick={onOpenAddTransaction}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Transaction</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Gross Income"
          value={formatCurrency(totalIncome, settings.currency)}
          change="+14.2%"
          isPositive={true}
          subtext="monthly total"
          icon={TrendingUp}
        />

        <StatCard
          label="Operating Expenses"
          value={formatCurrency(totalExpenses, settings.currency)}
          change="-4.8%"
          isPositive={true}
          subtext="controlled overhead"
          icon={TrendingDown}
        />

        <StatCard
          label="Net Operating Profit"
          value={formatCurrency(netProfit, settings.currency)}
          change="76% Margin"
          isPositive={true}
          subtext="healthy return"
          icon={DollarSign}
        />

        <StatCard
          label="Outstanding Receivables"
          value={formatCurrency(totalOutstanding, settings.currency)}
          change="3 clients"
          isPositive={false}
          subtext="unpaid balances"
          icon={AlertCircle}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Revenue Trajectory
              </h3>
              <p className="text-xs text-neutral-500">
                Daily and weekly income growth in {settings.currency}
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
              {(['today', '7d', '30d', 'year'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeFilter(tf)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg uppercase transition-colors ${
                    timeFilter === tf
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <RevenueAreaChart data={chartPoints} currency={settings.currency} height={220} />
        </div>

        {/* Revenue by Service Donut */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Revenue by Service
            </h3>
            <p className="text-xs text-neutral-500">
              Top revenue drivers this month
            </p>
          </div>

          <ServiceBreakdownDonut slices={donutSlices} currency={settings.currency} />
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Ledger Transactions ({filteredTransactions.length})
            </h3>
            <p className="text-xs text-neutral-500">
              Audit record of all recorded income entries and expense deductions
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl self-start sm:self-auto">
            {(['all', 'income', 'expense'] as const).map((tp) => (
              <button
                key={tp}
                onClick={() => setTypeFilter(tp)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  typeFilter === tp
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {tp}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 divide-y divide-neutral-100 dark:divide-neutral-800">
          {filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isIncome
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {tx.description}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono mt-0.5">
                      <span>{tx.date}</span>
                      <span>·</span>
                      <span>{tx.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold font-mono tabular-nums ${
                      isIncome
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount, settings.currency)}
                  </span>

                  <button
                    onClick={() => {
                      if (confirm('Delete this transaction?')) {
                        deleteTransaction(tx.id);
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Delete Transaction"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
