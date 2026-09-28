import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Clock,
  Sparkles,
  CheckCircle,
  Trash2,
  Edit2,
  Plus,
} from 'lucide-react';
import { formatCurrency, getInitials } from '../../utils/formatters';

interface ClientProfileDrawerProps {
  clientId?: string;
  onClose: () => void;
  onBookAppointment: (clientId: string) => void;
}

export const ClientProfileDrawer: React.FC<ClientProfileDrawerProps> = ({
  clientId,
  onClose,
  onBookAppointment,
}) => {
  const {
    clients,
    appointments,
    transactions,
    settings,
    profession,
    updateClient,
    deleteClient,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'finances' | 'notes'>('overview');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesVal, setNotesVal] = useState('');

  if (!clientId) return null;

  const client = clients.find((c) => c.id === clientId);
  if (!client) return null;

  const clientAppointments = appointments.filter((a) => a.clientId === client.id);
  const clientTransactions = transactions.filter((t) => t.clientId === client.id);

  const handleSaveNotes = () => {
    updateClient(client.id, { notes: notesVal });
    setEditingNotes(false);
  };

  const handleSettleBalance = () => {
    updateClient(client.id, { outstandingBalance: 0 });
    showToast(`Outstanding balance settled for ${client.name}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-base border border-indigo-200/60 dark:border-indigo-800/60">
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
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {client.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {client.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400"
                    >
                      {i > 0 && <span className="mr-1 text-neutral-300">·</span>}
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick contact strip */}
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-300">
            <a
              href={`tel:${client.phone}`}
              className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              <span>{client.phone}</span>
            </a>
            {client.email && (
              <a
                href={`mailto:${client.email}`}
                className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span className="truncate max-w-[180px]">{client.email}</span>
              </a>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-neutral-200 dark:border-neutral-800 px-6 gap-6 bg-neutral-50/50 dark:bg-neutral-900/50">
          {(['overview', 'appointments', 'finances', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-xs font-semibold border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {tab === 'appointments' ? profession.appointmentLabel.plural : tab}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Stat grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                    Total Visits
                  </span>
                  <div className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums font-mono mt-1">
                    {client.totalVisits}
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Last: {client.lastVisit}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                    Lifetime Spend
                  </span>
                  <div className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums font-mono mt-1">
                    {formatCurrency(client.totalSpent, settings.currency)}
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block">
                    High value regular
                  </span>
                </div>
              </div>

              {/* Outstanding balance card */}
              {client.outstandingBalance > 0 ? (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                      Unpaid Balance: {formatCurrency(client.outstandingBalance, settings.currency)}
                    </span>
                    <p className="text-[11px] text-amber-700/80 dark:text-amber-400 mt-0.5">
                      From previous styling session
                    </p>
                  </div>
                  <button
                    onClick={handleSettleBalance}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Mark Paid
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 flex items-center gap-2 text-xs text-neutral-500">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>No unpaid invoices or outstanding balances</span>
                </div>
              )}

              {/* Preferences & favorite service */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Favorite {profession.serviceLabel.singular}
                  </span>
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {client.favoriteService || 'Classic Fade Haircut'}
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white block mb-1">
                    Special Notes
                  </span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {client.notes || 'No special preferences noted yet.'}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onBookAppointment(client.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule Appointment</span>
                </button>
              </div>
            </div>
          )}

          {/* APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-neutral-500">
                  History ({clientAppointments.length})
                </span>
                <button
                  onClick={() => onBookAppointment(client.id)}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  + New Booking
                </button>
              </div>

              {clientAppointments.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  No appointments recorded yet.
                </div>
              ) : (
                clientAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                        {apt.serviceName}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono mt-0.5">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        <span>{apt.date}</span>
                        <span>·</span>
                        <span>{apt.startTime} – {apt.endTime}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-neutral-900 dark:text-white">
                        {formatCurrency(apt.price, settings.currency)}
                      </div>
                      <span className="text-[10px] font-medium capitalize text-neutral-500">
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* FINANCES TAB */}
          {activeTab === 'finances' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-neutral-500 mb-2">
                Payment History
              </div>
              {clientTransactions.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  No direct transactions recorded.
                </div>
              ) : (
                clientTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                        {tx.description}
                      </p>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        {tx.date} · {tx.category}
                      </p>
                    </div>
                    <span className="text-xs font-bold font-mono text-emerald-600">
                      +{formatCurrency(tx.amount, settings.currency)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* NOTES TAB */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500">
                  Client Profile Notes
                </span>
                {!editingNotes ? (
                  <button
                    onClick={() => {
                      setNotesVal(client.notes);
                      setEditingNotes(true);
                    }}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveNotes}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    Save
                  </button>
                )}
              </div>

              {editingNotes ? (
                <textarea
                  rows={5}
                  value={notesVal}
                  onChange={(e) => setNotesVal(e.target.value)}
                  className="w-full p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              ) : (
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {client.notes || 'No notes added yet.'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Delete Action */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${client.name}?`)) {
                deleteClient(client.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete {profession.clientLabel.singular}</span>
          </button>

          <span className="text-[11px] font-mono text-neutral-400">
            ID: {client.id}
          </span>
        </div>
      </div>
    </div>
  );
};
