import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROFESSIONS } from '../data/professions';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Building,
  DollarSign,
  Clock,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { CurrencyCode, ProfessionId } from '../types';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { setProfession, updateSettings, settings, showToast } = useApp();

  const [step, setStep] = useState(1);
  const [selectedProf, setSelectedProf] = useState<ProfessionId>(settings.profession);
  const [businessName, setBusinessName] = useState(settings.businessName || 'My Studio');
  const [currency, setCurr] = useState<CurrencyCode>(settings.currency || 'UZS');
  const [workingDays, setWorkingDays] = useState<string[]>(settings.workingDays);
  const [startHour, setStartHour] = useState(settings.workingHoursStart || '09:00');
  const [endHour, setEndHour] = useState(settings.workingHoursEnd || '20:00');
  const [aiTone, setAiTone] = useState<'proactive' | 'concise' | 'detailed'>('proactive');

  const allProfessions = Object.values(PROFESSIONS);
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (d: string) => {
    if (workingDays.includes(d)) {
      setWorkingDays(workingDays.filter((x) => x !== d));
    } else {
      setWorkingDays([...workingDays, d]);
    }
  };

  const handleNext = () => {
    if (step === 2) {
      setProfession(selectedProf, true);
    }
    if (step < 8) {
      setStep(step + 1);
    } else {
      // Finalize
      updateSettings({
        businessName,
        currency,
        workingDays,
        workingHoursStart: startHour,
        workingHoursEnd: endHour,
        aiTone,
      });
      showToast('Your AI Administrator is ready!', 'success');
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-neutral-900 dark:text-white">
              AI ADMIN Setup
            </span>
          </div>

          <span className="text-xs font-mono font-medium text-neutral-400">
            Step {step} of 8
          </span>
        </div>

        {/* Dynamic Wizard Steps */}
        <div className="py-6 min-h-[360px] flex flex-col justify-center">
          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div className="space-y-4 text-center max-w-lg mx-auto py-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-200 dark:border-indigo-800">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Let's set up your AI Administrator
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Welcome to AI ADMIN. We'll tailor your calendar, service catalog, terminology, and proactive notifications to your specific craft in just 2 minutes.
              </p>
            </div>
          )}

          {/* STEP 2: Choose Profession */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  What is your profession?
                </h3>
                <p className="text-xs text-neutral-500">
                  Select your specialty to adapt terminology and workflows.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {allProfessions.map((p) => {
                  const isSelected = selectedProf === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProf(p.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                      }`}
                    >
                      <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                        {p.name.split('&')[0]}
                      </span>
                      <span className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                        {p.clientLabel.plural} & {p.appointmentLabel.plural}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Business Name */}
          {step === 3 && (
            <div className="space-y-4 max-w-md mx-auto py-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  What is your business name?
                </h3>
                <p className="text-xs text-neutral-500">
                  The name of your studio, salon, clinic, or private practice.
                </p>
              </div>

              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. AZ Studio, Tashkent Dental"
                className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 text-center font-medium"
              />
            </div>
          )}

          {/* STEP 4: Currency */}
          {step === 4 && (
            <div className="space-y-4 max-w-md mx-auto py-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Select your primary currency
                </h3>
                <p className="text-xs text-neutral-500">
                  Used for all pricing, revenue tracking, and invoice calculations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { code: 'UZS', label: 'Uzbek Som (UZS)', default: true },
                  { code: 'USD', label: 'US Dollar (USD)' },
                  { code: 'EUR', label: 'Euro (EUR)' },
                  { code: 'RUB', label: 'Russian Ruble (RUB)' },
                ].map((c) => (
                  <button
                    type="button"
                    key={c.code}
                    onClick={() => setCurr(c.code as CurrencyCode)}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                      currency === c.code
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                        : 'border-neutral-200 dark:border-neutral-800'
                    }`}
                  >
                    <span className="text-sm font-bold text-neutral-900 dark:text-white block font-mono">
                      {c.code}
                    </span>
                    <span className="text-[11px] text-neutral-500 mt-0.5 block">
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Working Days */}
          {step === 5 && (
            <div className="space-y-4 max-w-md mx-auto py-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Which days are you open?
                </h3>
                <p className="text-xs text-neutral-500">
                  Clients can only book appointments on your active days.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {daysOfWeek.map((day) => {
                  const active = workingDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Working Hours */}
          {step === 6 && (
            <div className="space-y-4 max-w-md mx-auto py-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Daily working hours
                </h3>
                <p className="text-xs text-neutral-500">
                  When do you start and wrap up appointments?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Services preview */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Pre-loaded Services Catalog
                </h3>
                <p className="text-xs text-neutral-500">
                  We have seeded industry-standard pricing and durations for {PROFESSIONS[selectedProf].name}.
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {PROFESSIONS[selectedProf].defaultServices.map((ds, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {ds.name}
                      </span>
                      <span className="text-[11px] text-neutral-400 block">
                        {ds.durationMinutes} min · {ds.category}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {ds.priceUZS.toLocaleString()} UZS
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: AI Preferences & Ready */}
          {step === 8 && (
            <div className="space-y-4 text-center max-w-md mx-auto py-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Your AI Administrator is ready.
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Everything is primed. You can now track your daily appointments, monitor real earnings, and converse directly with your virtual assistant.
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-100 dark:border-neutral-800">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <span>{step === 8 ? 'Launch Dashboard' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
