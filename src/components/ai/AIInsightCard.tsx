import React from 'react';
import { AIInsight } from '../../types';
import { Sparkles, ArrowRight, X, AlertCircle, TrendingUp, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AIInsightCardProps {
  insight: AIInsight;
  onDismiss?: () => void;
  onAction?: () => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  insight,
  onDismiss,
  onAction,
}) => {
  const { setCurrentView, setActiveClientFilter, setIsAIAssistantOpen } = useApp();

  const handleAction = () => {
    if (onAction) {
      onAction();
      return;
    }

    if (insight.actionType === 'view_clients') {
      setActiveClientFilter('inactive');
      setCurrentView('clients');
    } else if (insight.actionType === 'create_appointment') {
      setCurrentView('appointments');
    } else if (insight.actionType === 'view_analytics') {
      setCurrentView('analytics');
    } else {
      setIsAIAssistantOpen(true);
    }
  };

  const icons = {
    warning: <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />,
    opportunity: <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />,
    trend: <TrendingUp className="w-4 h-4 text-blue-500 shrink-0" />,
    client: <Users className="w-4 h-4 text-purple-500 shrink-0" />,
  };

  return (
    <div className="relative p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {icons[insight.type]}
            <h4 className="text-xs font-semibold text-neutral-900 dark:text-white leading-snug">
              {insight.title}
            </h4>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              title="Dismiss insight"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {insight.description}
        </p>
      </div>

      {insight.actionText && (
        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
          <button
            onClick={handleAction}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <span>{insight.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
