import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface PlayerStats {
  goals?: number;
  assists?: number;
  points?: number;
  plusMinus?: number;
  pim?: number;
  sog?: number;
  hits?: number;
  blocks?: number;
  fow?: number;
  wins?: number;
  losses?: number;
  shutouts?: number;
  savePercentage?: number;
  [key: string]: number | undefined;
}

interface PlayerCardProps {
  name: string;
  team: string;
  position: string;
  number?: string;
  image?: string;
  stats?: PlayerStats;
  status?: 'healthy' | 'questionable' | 'injured' | 'out';
  nextGame?: {
    opponent: string;
    date: string;
  };
  className?: string;
  compact?: boolean;
  // Add missing properties
  available?: boolean;
  owner?: string | null;
  nextStart?: string | null;
}

// Add a simple AnimatedNumber component for stat animation
const AnimatedNumber = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(value);
  React.useEffect(() => {
    let frame: number;
    const start = display;
    const end = value;
    const duration = 400;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplay(start + (end - start) * progress);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setDisplay(end);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line
  }, [value]);
  return <span>{display.toFixed(1)}</span>;
};

const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  team,
  position,
  number,
  image,
  stats,
  status = 'healthy',
  nextGame,
  className,
  compact = false,
  available,
  owner,
  nextStart,
}) => {
  const statusColors = {
    healthy: 'bg-green-500',
    questionable: 'bg-yellow-400',
    injured: 'bg-amber-500',
    out: 'bg-red-500',
  };

  // Status tooltip helper
  const statusLabels = {
    healthy: 'Healthy',
    questionable: 'Questionable',
    injured: 'Injured',
    out: 'Out',
  };

  const positionBadgeColors = {
    'LW': 'bg-green-500 text-white shadow-green-400/40',
    'RW': 'bg-blue-500 text-white shadow-blue-400/40',
    'C': 'bg-red-500 text-white shadow-red-400/40',
    'D': 'bg-teal-500 text-white shadow-teal-400/40',
    'G': 'bg-purple-500 text-white shadow-purple-400/40',
  };
  const getPositionBadgeColor = () => {
    for (const [pos, color] of Object.entries(positionBadgeColors)) {
      if (position.includes(pos)) {
        return color;
      }
    }
    return 'bg-muted text-card-foreground';
  };

  if (compact) {
    return (
      <div className={cn(
        "flex items-center p-3 rounded-lg bg-card text-card-foreground border border-border shadow-sm hover:scale-[1.025] hover:shadow-lg hover:border-hockey-blue/60 transition-transform duration-200 relative overflow-hidden",
        className
      )}>
        {/* Ice pattern overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 100 100" fill="none"><defs><pattern id="ice" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M0 0L20 20ZM20 0L0 20Z" stroke="#38BDF8" strokeWidth="0.5"/></pattern></defs><rect width="100" height="100" fill="url(#ice)" /></svg>
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3 overflow-hidden relative">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold text-hockey-blue text-lg">{name.charAt(0)}</span>
          )}
          {/* Status dot with tooltip */}
          <div className="absolute -bottom-1 -right-1 group">
            <span className={cn("block w-3 h-3 rounded-full border-2 border-card", statusColors[status])}></span>
            <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-card text-xs text-card-foreground opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10 shadow-lg">{statusLabels[status]}</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{name}</h3>
          </div>
          <div className="flex items-center text-xs">
            <span className={cn("px-1.5 py-0.5 rounded font-bold shadow-md ring-2 ring-white/30 dark:ring-black/30", getPositionBadgeColor())}>{position}</span>
            <span className="mx-1.5 text-muted-foreground">•</span>
            <span className="text-muted-foreground">{team}</span>
            {owner && !available && (
              <>
                <span className="mx-1.5 text-muted-foreground">•</span>
                <span className="text-muted-foreground">{owner}</span>
              </>
            )}
          </div>
        </div>
        {stats && (position !== 'G' ? stats.points !== undefined : stats.wins !== undefined) && (
          <div className="text-right">
            {position !== 'G' ? (
              <>
                <div className="text-sm font-semibold text-card-foreground">
                  <AnimatedNumber value={Number(stats.points)} /> pts
                </div>
                <div className="text-xs text-muted-foreground">
                  {stats.goals || 0}G, {stats.assists || 0}A
                </div>
              </>
            ) : (
              <>
                <div className="text-sm font-semibold text-card-foreground">
                  <AnimatedNumber value={Number(stats.wins)} />-{stats.losses}-0
                </div>
                <div className="text-xs text-muted-foreground">
                  {stats.savePercentage ? (stats.savePercentage.toFixed(3)).toString().substring(1) : '.000'} SV%
                </div>
              </>
            )}
          </div>
        )}
        {nextStart && (
          <div className="ml-2 text-xs text-green-600 hidden md:block">{nextStart}</div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl bg-card text-card-foreground border border-border shadow-sm overflow-hidden hover-card", className)}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-lg bg-hockey-ice/50 flex items-center justify-center mr-4 overflow-hidden">
              {image ? (
                <img src={image} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-hockey-blue text-lg">{name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-medium flex items-center gap-2">
                {name}
                {number && <span className="text-sm text-hockey-light-slate">#{number}</span>}
                <div className={cn("ml-2 h-2.5 w-2.5 rounded-full", statusColors[status])} title={status}></div>
              </h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-hockey-light-slate">
                <span className={cn("px-2 py-0.5 rounded-md border", getPositionBadgeColor())}>{position}</span>
                <span>{team}</span>
                {owner && !available && (
                  <span className="text-hockey-light-slate">Owned by: {owner}</span>
                )}
              </div>
            </div>
          </div>
          {nextGame && (
            <div className="text-right text-sm">
              <div className="text-hockey-light-slate">Next Game:</div>
              <div className="font-medium text-hockey-slate">{nextGame.opponent}</div>
              <div className="text-xs text-hockey-light-slate">{nextGame.date}</div>
              {position === 'G' && nextStart && (
                <div className="text-xs text-green-600 font-medium mt-1">Starting: {nextStart}</div>
              )}
            </div>
          )}
        </div>

        {stats && (
          <div className="mt-4 grid grid-cols-4 gap-3 pt-4 border-t border-slate-100">
            {position !== 'G' ? (
              <>
                {stats.goals !== undefined && (
                  <div className="text-center">
                    <div className="text-xl font-semibold text-hockey-slate">{stats.goals}</div>
                    <div className="text-xs text-hockey-light-slate">Goals</div>
                  </div>
                )}
                {stats.assists !== undefined && (
                  <div className="text-center">
                    <div className="text-xl font-semibold text-hockey-slate">{stats.assists}</div>
                    <div className="text-xs text-hockey-light-slate">Assists</div>
                  </div>
                )}
                {stats.points !== undefined && (
                  <div className="text-center">
                    <div className="text-xl font-semibold text-hockey-slate">{stats.points}</div>
                    <div className="text-xs text-hockey-light-slate">Points</div>
                  </div>
                )}
                {stats.plusMinus !== undefined && (
                  <div className="text-center">
                    <div className={cn(
                      "text-xl font-semibold",
                      stats.plusMinus > 0 ? "text-green-500" : 
                      stats.plusMinus < 0 ? "text-red-500" : "text-hockey-slate"
                    )}>
                      {stats.plusMinus > 0 ? `+${stats.plusMinus}` : stats.plusMinus}
                    </div>
                    <div className="text-xs text-hockey-light-slate">+/-</div>
                  </div>
                )}
              </>
            ) : (
              <>
                {stats.wins !== undefined && (
                  <div className="text-center">
                    <div className="text-xl font-semibold text-hockey-slate">{stats.wins}</div>
                    <div className="text-xs text-hockey-light-slate">Wins</div>
                  </div>
                )}
                {stats.shutouts !== undefined && (
                  <div className="text-center">
                    <div className="text-xl font-semibold text-hockey-slate">{stats.shutouts}</div>
                    <div className="text-xs text-hockey-light-slate">Shutouts</div>
                  </div>
                )}
                {stats.savePercentage !== undefined && (
                  <div className="text-center">
                    <div className="text-xl font-semibold text-hockey-slate">
                      {(stats.savePercentage.toFixed(3)).toString().substring(1)}
                    </div>
                    <div className="text-xs text-hockey-light-slate">SV%</div>
                  </div>
                )}
                {stats.wins !== undefined && stats.losses !== undefined && (
                  <div className="text-center">
                    <div className="text-xl font-semibold text-hockey-slate">{stats.wins}-{stats.losses}-0</div>
                    <div className="text-xs text-hockey-light-slate">Record</div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
