import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  icon?: LucideIcon;
  badgeText?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  isPositive = true,
  subtext,
  icon: Icon,
  badgeText,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all ${
        onClick ? 'cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-xs' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          {label}
        </span>
        {Icon && (
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
          {value}
        </span>
      </div>

      {(change || subtext || badgeText) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          {change && (
            <span
              className={`font-semibold tabular-nums ${
                isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {change}
            </span>
          )}
          {change && subtext && <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>}
          {subtext && <span>{subtext}</span>}
          {badgeText && (
            <>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">{badgeText}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
