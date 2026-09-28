import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROFESSIONS } from '../data/professions';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  MessageSquare,
  Bot,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: () => void;
  onOpenDemo: () => void;
  onOpenOnboarding: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onOpenDemo,
  onOpenOnboarding,
}) => {
  const { setProfession, profession } = useApp();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedProfPreview, setSelectedProfPreview] = useState('barber');

  const faqs = [
    {
      q: 'How does AI Admin differ from generic booking software?',
      a: 'Traditional software is passive: you must manually click through 10 screens to discover who hasn\'t visited or what slots are open. AI Admin actively summarizes your day, flags unconfirmed appointments, highlights unpaid balances, and answers questions like "How much did I earn this month?" in plain natural language.',
    },
    {
      q: 'Can I use AI Admin for my specific profession?',
      a: 'Yes! AI Admin dynamically adapts its terminology, workflows, and default services whether you are a barber, cosmetologist, dentist, technician, tutor, photographer, freelancer, doctor, or fitness coach.',
    },
    {
      q: 'Does it support Uzbek Som (UZS) and international currencies?',
      a: 'Yes, full native support for UZS, USD, EUR, and RUB with space thousands separators and standard regional business practices.',
    },
    {
      q: 'Can I connect it to my existing database or Telegram bot?',
      a: 'Absolutely. The platform is architected with a decoupled service abstraction layer ready to link with Firebase, PostgreSQL, Supabase, or custom REST APIs.',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased selection:bg-indigo-500/20 selection:text-indigo-600">
      {/* Top Navigation Bar: 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
              AI ADMIN
            </span>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
              How it Works
            </a>
            <a href="#professions" className="hover:text-indigo-600 transition-colors">
              Professions
            </a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenDemo}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
            >
              See Demo
            </button>
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal AI Administrator for Independent Professionals</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white max-w-4xl mx-auto leading-tight text-balance">
            Your business deserves an AI administrator.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Manage clients, appointments, payments, and daily operations — while AI actively keeps you informed about what matters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onOpenOnboarding}
              className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Start Free with Onboarding</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 rounded-xl transition-colors cursor-pointer"
            >
              Open Interactive Studio Demo
            </button>
          </div>

          {/* Claim to Proof Stat Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/70 dark:border-neutral-800">
              <span className="text-xl font-bold font-mono text-neutral-900 dark:text-white block tabular-nums">
                12+
              </span>
              <span className="text-[11px] text-neutral-500">
                Universal Professions
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/70 dark:border-neutral-800">
              <span className="text-xl font-bold font-mono text-neutral-900 dark:text-white block tabular-nums">
                +14.2%
              </span>
              <span className="text-[11px] text-neutral-500">
                Average Revenue Lift
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/70 dark:border-neutral-800">
              <span className="text-xl font-bold font-mono text-neutral-900 dark:text-white block tabular-nums">
                100%
              </span>
              <span className="text-[11px] text-neutral-500">
                Proactive Schedule Alerts
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/70 dark:border-neutral-800">
              <span className="text-xl font-bold font-mono text-neutral-900 dark:text-white block tabular-nums">
                UZS / Multi
              </span>
              <span className="text-[11px] text-neutral-500">
                Currency Ready
              </span>
            </div>
          </div>
        </div>

        {/* Hero Visual Asset */}
        <div className="max-w-5xl mx-auto mt-12 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl relative">
          <img
            src="/src/assets/images/hero_saas_preview_1790573651857.jpg"
            alt="AI Admin Platform UI Preview"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover max-h-[520px]"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">
              Daily Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mt-1">
              Instead of manual analysis, AI tells you what matters
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              Every morning, your AI Administrator audits your calendar, detects unconfirmed clients, flags unpaid balances, and highlights available time slots.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Morning Proactive Briefing
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                “Good morning, Aziz! You have 8 appointments today. 3 are unconfirmed. Yesterday’s revenue was 450,000 UZS. Aziz Karimov is your top client.”
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Conversational Inquiries
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Ask in plain text: “How much did I earn this month?”, “Who haven't visited for 30 days?”, or “Which day is busiest?”. Get instant factual answers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                One-Click Action Execution
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Directly book slots, confirm appointments, record income transactions, or generate follow-up reminders right from AI recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UNIVERSAL PROFESSIONS SHOWCASE */}
      <section id="professions" className="py-20 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">
              Adaptability
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mt-1">
              One platform. Adapted for every craft.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              Select your profession and watch terminology, services, and widgets instantly change.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.values(PROFESSIONS).map((prof) => (
              <div
                key={prof.id}
                onClick={() => {
                  setProfession(prof.id, true);
                  setSelectedProfPreview(prof.id);
                }}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedProfPreview === prof.id
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                }`}
              >
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  {prof.name}
                </span>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  {prof.clientLabel.plural} · {prof.appointmentLabel.plural} · {prof.serviceLabel.plural}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onOpenDemo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <span>Test Current Profession in Live App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="pricing" className="py-20 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">
              Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mt-1">
              Simple plans for independent growth
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              Start free, upgrade as your appointment volume and client base expand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Starter Free
                </span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-neutral-900 dark:text-white font-mono">
                    0
                  </span>
                  <span className="text-xs text-neutral-500">UZS / month</span>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  For solo apprentices and newly launched independent specialists.
                </p>

                <div className="mt-6 space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Up to 50 active clients</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Daily schedule calendar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Basic revenue tracking</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenDemo}
                className="mt-8 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 text-neutral-900 dark:text-white transition-colors"
              >
                Use Free Tier
              </button>
            </div>

            {/* Pro */}
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border-2 border-indigo-600 shadow-xl relative flex flex-col justify-between">
              <span className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </span>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Professional
                </span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-neutral-900 dark:text-white font-mono">
                    120 000
                  </span>
                  <span className="text-xs text-neutral-500">UZS / month</span>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Complete AI Administrator capabilities for established masters and studios.
                </p>

                <div className="mt-6 space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Everything in Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span><strong>Full AI Administrator conversational assistant</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Proactive morning briefings & alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Unlimited clients & appointment history</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Advanced analytics & financial breakdown</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenDemo}
                className="mt-8 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
              >
                Start Pro Trial
              </button>
            </div>

            {/* Business */}
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Studio Business
                </span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-neutral-900 dark:text-white font-mono">
                    280 000
                  </span>
                  <span className="text-xs text-neutral-500">UZS / month</span>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Multi-chair salons, clinics, and teams needing multi-user coordination.
                </p>

                <div className="mt-6 space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Everything in Pro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Multi-staff schedule scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Priority dedicated AI intelligence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Custom Telegram booking integration</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenDemo}
                className="mt-8 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 text-neutral-900 dark:text-white transition-colors"
              >
                Contact for Business
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              Everything you need to know about the universal administrator platform.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-neutral-900 dark:text-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Stop guessing your business data. Let AI Admin manage it.
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Join independent barbers, doctors, tutors, and specialists who let AI run daily schedules and client intelligence.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenOnboarding}
              className="px-6 py-3 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
            >
              Get Started Free
            </button>
            <button
              onClick={onOpenDemo}
              className="px-6 py-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
            >
              Launch Live AZ Studio Demo
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER: Quiet Anti-Slop Compliant */}
      <footer className="py-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            AI ADMIN — Universal Business Platform
          </span>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#how-it-works" className="hover:underline">Documentation</a>
            <a href="#privacy" className="hover:underline">Privacy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            © 2026 AI Admin. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};
