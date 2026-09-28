import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  AlertCircle,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { formatCurrency, getInitials } from '../utils/formatters';

interface ClientsViewProps {
  onOpenAddClient: () => void;
  onOpenClientProfile: (clientId: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  onOpenAddClient,
  onOpenClientProfile,
}) => {
  const {
    clients,
    profession,
    settings,
    activeClientFilter,
    setActiveClientFilter,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>(activeClientFilter || 'all');
  const [sortBy, setSortBy] = useState<'visits' | 'spent' | 'name' | 'lastVisit'>('visits');

  const filteredClients = clients
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.notes.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (filterTag === 'vip') return c.tags.includes('VIP');
      if (filterTag === 'inactive') {
        return (
          c.tags.includes('Inactive >30d') ||
          c.tags.includes('Re-engage') ||
          c.tags.includes('Needs Outreach')
        );
      }
      if (filterTag === 'unpaid') return c.outstandingBalance > 0;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'visits') return b.totalVisits - a.totalVisits;
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {profession.clientLabel.plural} Directory
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Track client history, visit patterns, lifetime value, and balances.
          </p>
        </div>

        <button
          onClick={onOpenAddClient}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add {profession.clientLabel.singular}</span>
        </button>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${profession.clientLabel.plural.toLowerCase()} by name, phone, notes...`}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-indigo-500 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
          />
        </div>

        {/* Filter Chips & Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
            {[
              { id: 'all', label: 'All' },
              { id: 'vip', label: 'VIP' },
              { id: 'inactive', label: 'Inactive >30d' },
              { id: 'unpaid', label: 'Unpaid' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setFilterTag(f.id);
                  setActiveClientFilter(f.id === 'all' ? undefined : f.id);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  filterTag === f.id
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs text-neutral-600 dark:text-neutral-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-0 focus:outline-none font-medium cursor-pointer"
            >
              <option value="visits">Most Visits</option>
              <option value="spent">Highest Spend</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table / Cards */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            {filteredClients.length} {profession.clientLabel.plural} listed
          </span>
          <span className="text-xs text-neutral-400">
            Click on any client to view profile & history
          </span>
        </div>

        {filteredClients.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              No {profession.clientLabel.plural.toLowerCase()} found
            </h4>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              No matching records for your current search or filter query.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => onOpenClientProfile(client.id)}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 px-3 rounded-xl transition-all cursor-pointer group"
              >
                {/* Client Avatar & Details */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 border border-neutral-200 dark:border-neutral-700">
                    {client.avatar ? (
                      <img
                        src={client.avatar}
                        alt={client.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span>{getInitials(client.name)}</span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        {client.name}
                      </h4>
                      {client.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] text-neutral-500 dark:text-neutral-400 hidden sm:inline"
                        >
                          · {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
                      <span>{client.phone}</span>
                      <span className="hidden sm:inline">·</span>
                      <span className="hidden sm:inline font-sans truncate max-w-[200px]">
                        {client.notes}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics: Visits, Total Spent, Outstanding Balance */}
                <div className="flex items-center justify-between md:justify-end gap-6 pl-13 md:pl-0">
                  <div className="text-left md:text-right">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white tabular-nums font-mono block">
                      {client.totalVisits} visits
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Last: {client.lastVisit}
                    </span>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <span className="text-xs font-bold font-mono text-neutral-900 dark:text-white tabular-nums block">
                      {formatCurrency(client.totalSpent, settings.currency)}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Lifetime spend
                    </span>
                  </div>

                  {client.outstandingBalance > 0 ? (
                    <div className="text-right min-w-[90px]">
                      <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums block">
                        {formatCurrency(client.outstandingBalance, settings.currency)}
                      </span>
                      <span className="text-[10px] text-amber-500 font-medium">
                        Unpaid Balance
                      </span>
                    </div>
                  ) : (
                    <div className="text-right min-w-[90px] hidden sm:block">
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 block">
                        Settled
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Zero debt
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
