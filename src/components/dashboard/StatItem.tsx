
import React from 'react';
import { cn } from '@/lib/utils';
import AnimatedNumber from '../ui-elements/AnimatedNumber';

interface StatItemProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  animate?: boolean;
  className?: string;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  icon,
  prefix = '',
  suffix = '',
  trend,
  trendValue,
  animate = true,
  className,
}) => {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-slate-400',
  };
  
  const trendIcons = {
    up: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    down: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    neutral: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    ),
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-2 text-hockey-light-slate text-sm mb-1">
        {label}
        {trend && (
          <span className={cn("flex items-center gap-1 text-xs", trendColors[trend])}>
            {trendIcons[trend]}
            {trendValue}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {icon && <span className="text-hockey-light-blue">{icon}</span>}
        <div className="text-hockey-slate font-semibold text-2xl">
          {prefix}
          {typeof value === 'number' && animate ? (
            <AnimatedNumber value={value} />
          ) : (
            value
          )}
          {suffix}
        </div>
      </div>
    </div>
  );
};

export default StatItem;
