import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  User,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { todayStr, tomorrowStr } from '../data/initialData';

interface AppointmentsViewProps {
  onOpenAddAppointment: () => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  onOpenAddAppointment,
}) => {
  const {
    appointments,
    profession,
    settings,
    updateAppointmentStatus,
    updatePaymentStatus,
    activeAppointmentFilter,
    setActiveAppointmentFilter,
    setSelectedClientId,
    setCurrentView,
  } = useApp();

  const [calendarMode, setCalendarMode] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [statusFilter, setStatusFilter] = useState<string>(
    activeAppointmentFilter || 'all'
  );

  // Time grid slots for Day View (from 09:00 to 20:00)
  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ];

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const dayAppointments = appointments.filter((a) => {
    const matchDate = a.date === selectedDate;
    if (!matchDate) return false;
    if (statusFilter !== 'all') {
      return a.status === statusFilter;
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'border-l-4 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20';
      case 'pending':
        return 'border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20';
      case 'completed':
        return 'border-l-4 border-neutral-400 bg-neutral-50 dark:bg-neutral-800/40 opacity-75';
      case 'cancelled':
        return 'border-l-4 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 opacity-60';
      case 'no-show':
        return 'border-l-4 border-purple-500 bg-purple-50/50 dark:bg-purple-950/20';
      default:
        return 'border-l-4 border-indigo-500 bg-neutral-50 dark:bg-neutral-800/50';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {profession.appointmentLabel.plural} Schedule
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your daily calendar, time slots, and confirmation workflow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setCalendarMode(mode)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                  calendarMode === mode
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenAddAppointment}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Slot</span>
          </button>
        </div>
      </div>

      {/* Date Navigation & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="px-2.5 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNextDay}
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold text-neutral-900 dark:text-white bg-transparent border-0 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0">
            Filter:
          </span>
          {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setActiveAppointmentFilter(st === 'all' ? undefined : st);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer shrink-0 ${
                statusFilter === st
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Calendar View Area */}
      {calendarMode === 'day' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Timeline for {selectedDate} ({dayAppointments.length} bookings)
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Working Hours: {settings.workingHoursStart} – {settings.workingHoursEnd}
            </span>
          </div>

          {dayAppointments.length === 0 ? (
            <div className="py-16 text-center">
              <CalendarIcon className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                No appointments for this date
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                This day is completely free. You can add walk-in bookings or accept client inquiries.
              </p>
              <button
                onClick={onOpenAddAppointment}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {dayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 transition-all ${getStatusColor(
                    apt.status
                  )}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Time & Client */}
                    <div className="flex items-start gap-4">
                      <div className="w-20 shrink-0">
                        <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono block">
                          {apt.startTime}
                        </span>
                        <span className="text-xs text-neutral-500 font-mono">
                          {apt.endTime}
                        </span>
                        <span className="text-[10px] text-neutral-400 block mt-0.5">
                          {apt.durationMinutes} min
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedClientId(apt.clientId);
                              setCurrentView('clients');
                            }}
                            className="text-sm font-bold text-neutral-900 dark:text-white hover:text-indigo-600 hover:underline cursor-pointer"
                          >
                            {apt.clientName}
                          </button>
                          <span className="text-xs text-neutral-400">·</span>
                          <span className="text-xs font-semibold uppercase text-neutral-500 font-mono text-[10px]">
                            {apt.status}
                          </span>
                        </div>

                        <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                          {apt.serviceName}
                        </div>

                        {apt.notes && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                            "{apt.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price, Payment & Action Buttons */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200/40">
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
                          {formatCurrency(apt.price, settings.currency)}
                        </div>
                        <button
                          onClick={() =>
                            updatePaymentStatus(
                              apt.id,
                              apt.paymentStatus === 'paid' ? 'unpaid' : 'paid'
                            )
                          }
                          className={`text-xs font-semibold underline cursor-pointer ${
                            apt.paymentStatus === 'paid'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {apt.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                        </button>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                            className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 rounded-xl transition-colors"
                          >
                            Confirm
                          </button>
                        )}

                        {apt.status !== 'completed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            className="p-2 text-neutral-500 hover:text-emerald-600 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="Mark completed"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {apt.status !== 'no-show' && apt.status !== 'completed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'no-show')}
                            className="p-2 text-neutral-500 hover:text-purple-600 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="Mark no-show"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>
                        )}

                        {apt.status !== 'cancelled' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                            className="p-2 text-neutral-500 hover:text-rose-600 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="Cancel appointment"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Week / Month placeholder view that shows all upcoming schedule */}
      {calendarMode !== 'day' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white capitalize">
              {calendarMode} View — All Upcoming Bookings
            </h3>
            <span className="text-xs text-neutral-400">
              Total {appointments.length} appointments recorded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {a.date} · {a.startTime}
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700">
                    {a.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {a.clientName}
                  </h4>
                  <p className="text-xs text-neutral-500">{a.serviceName}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700 text-xs">
                  <span className="font-mono font-bold">
                    {formatCurrency(a.price, settings.currency)}
                  </span>
                  <span className={a.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}>
                    {a.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
