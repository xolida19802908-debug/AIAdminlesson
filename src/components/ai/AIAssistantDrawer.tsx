import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface AIAssistantDrawerProps {
  onOpenAddAppointment?: () => void;
  onOpenAddClient?: () => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  onOpenAddAppointment,
  onOpenAddClient,
}) => {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    chatMessages,
    isAIThinking,
    sendChatMessage,
    handleAIQuickAction,
    settings,
    profession,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIAssistantOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isAIAssistantOpen, chatMessages, isAIThinking]);

  if (!isAIAssistantOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isAIThinking) return;
    const text = inputVal.trim();
    setInputVal('');
    sendChatMessage(text);
  };

  const sampleQuestions = [
    { label: "Today's summary", query: 'What appointments do I have today?' },
    { label: 'Revenue analysis', query: 'How much did I earn this month?' },
    { label: 'Inactive clients', query: 'Show me clients who haven\'t returned for 30 days' },
    { label: 'Unpaid balances', query: 'How much money is still unpaid?' },
    { label: 'Busiest day', query: 'Which day was the busiest?' },
    { label: 'Top clients', query: 'Who are my most frequent clients?' },
    { label: 'Profitable service', query: 'Which service makes the most revenue?' },
    { label: 'Weekly focus', query: 'What should I focus on this week?' },
  ];

  const handleActionClick = (action: string) => {
    if (action === 'open_add_appointment' && onOpenAddAppointment) {
      onOpenAddAppointment();
      setIsAIAssistantOpen(false);
      return;
    }
    if (action === 'open_add_client' && onOpenAddClient) {
      onOpenAddClient();
      setIsAIAssistantOpen(false);
      return;
    }
    handleAIQuickAction(action);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAIAssistantOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header with Glowing AI Orb */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20">
              <span className="absolute inset-0 rounded-xl bg-indigo-500/40 animate-ping opacity-25" />
              <Sparkles className="w-4 h-4 text-white relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  AI Administrator
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Connected to {settings.businessName} · {profession.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAIAssistantOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 bg-neutral-100/60 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
            Ask:
          </span>
          {sampleQuestions.slice(0, 5).map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendChatMessage(q.query)}
              className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-indigo-50 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1 whitespace-nowrap transition-colors cursor-pointer"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg) => {
            const isAI = msg.sender === 'ai';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[10px] font-medium text-neutral-400">
                    {isAI ? 'AI Admin' : settings.ownerName}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {msg.timestamp}
                  </span>
                </div>

                <div
                  className={`max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isAI
                      ? 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700/60'
                      : 'bg-indigo-600 text-white font-medium'
                  }`}
                >
                  <div className="whitespace-pre-line space-y-1.5">
                    {msg.text.split('\n').map((line, lIdx) => {
                      if (!line.trim()) return <div key={lIdx} className="h-1.5" />;
                      // Render simple bold markdown
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={lIdx}>
                          {parts.map((p, pIdx) => {
                            if (p.startsWith('**') && p.endsWith('**')) {
                              return (
                                <strong key={pIdx} className="font-semibold text-neutral-900 dark:text-white">
                                  {p.slice(2, -2)}
                                </strong>
                              );
                            }
                            return p;
                          })}
                        </p>
                      );
                    })}
                  </div>

                  {/* Render optional data cards */}
                  {msg.dataCard && (
                    <div className="mt-3 p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white">
                      <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        {msg.dataCard.title}
                      </div>
                      <div className="space-y-1.5">
                        {msg.dataCard.items.map((item, itIdx) => (
                          <div
                            key={itIdx}
                            className="flex items-center justify-between text-xs py-1 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                          >
                            <span className="text-neutral-600 dark:text-neutral-400">
                              {item.label}
                            </span>
                            <div className="text-right">
                              <span className="font-semibold font-mono tabular-nums">
                                {item.value}
                              </span>
                              {item.hint && (
                                <span className="block text-[10px] text-neutral-400">
                                  {item.hint}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Action buttons */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-700/80 flex flex-wrap gap-1.5">
                      {msg.quickActions.map((qa, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleActionClick(qa.action)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 border border-neutral-200 dark:border-neutral-700 shadow-xs transition-colors cursor-pointer"
                        >
                          <span>{qa.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* AI Thinking indicator */}
          {isAIThinking && (
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                <span>AI Admin is analyzing your business data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
        >
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about revenue, schedule, clients..."
              disabled={isAIThinking}
              className="w-full pl-3.5 pr-12 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-indigo-500 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isAIThinking}
              className="absolute right-1.5 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400 px-1">
            <span>Powered by business intelligence</span>
            <span className="font-mono">Press Enter to send</span>
          </div>
        </form>
      </div>
    </div>
  );
};
