import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendScoreProps {
  score: number | null | undefined;
}

export function TrendScore({ score }: TrendScoreProps) {
  const trendValue = score ?? 0;

  if (trendValue === 0) {
    return (
      <div className="flex items-center justify-center">
        <Minus className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  if (trendValue > 0) {
    return (
      <div className="flex items-center justify-center">
        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
        <span className="ml-1 text-xs font-medium text-green-600 dark:text-green-400">
          +{trendValue}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
      <span className="ml-1 text-xs font-medium text-red-600 dark:text-red-400">
        {trendValue}
      </span>
    </div>
  );
}

