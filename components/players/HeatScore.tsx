import { cn } from '@/lib/utils';

interface HeatScoreProps {
  score: number | null | undefined;
}

export function HeatScore({ score }: HeatScoreProps) {
  const heatValue = score ?? 0;
  const isFire = heatValue > 0;
  const isIce = heatValue < 0;
  const count = Math.abs(heatValue);
  const maxCount = 3;

  if (heatValue === 0) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="flex items-center gap-0.5">
      {isFire && (
        <>
          {Array.from({ length: Math.min(count, maxCount) }).map((_, i) => (
            <span key={i} className="text-orange-500 dark:text-orange-400">🔥</span>
          ))}
        </>
      )}
      {isIce && (
        <>
          {Array.from({ length: Math.min(count, maxCount) }).map((_, i) => (
            <span key={i} className="text-blue-500 dark:text-blue-400">❄️</span>
          ))}
        </>
      )}
    </div>
  );
}

