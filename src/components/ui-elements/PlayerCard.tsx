
import React from 'react';
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

  const positionColors = {
    'C': 'text-blue-600 border-blue-200',
    'LW': 'text-green-600 border-green-200',
    'RW': 'text-green-600 border-green-200',
    'D': 'text-red-600 border-red-200',
    'G': 'text-purple-600 border-purple-200',
  };

  // Determine position color
  const getPositionColor = () => {
    for (const [pos, color] of Object.entries(positionColors)) {
      if (position.includes(pos)) {
        return color;
      }
    }
    return 'text-gray-600 border-gray-200';
  };

  if (compact) {
    return (
      <div className={cn("flex items-center p-3 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow transition-shadow", className)}>
        <div className="w-10 h-10 rounded-full bg-hockey-ice/50 flex items-center justify-center mr-3 overflow-hidden">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-hockey-blue font-semibold">{name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-hockey-slate">{name}</h3>
            <div className={cn("h-2 w-2 rounded-full", statusColors[status])} title={status}></div>
            {nextStart && position === 'G' && (
              <span className="text-xs text-green-600 font-medium">Starting</span>
            )}
          </div>
          <div className="flex items-center text-xs text-hockey-light-slate">
            <span className={cn("px-1.5 py-0.5 rounded border", getPositionColor())}>{position}</span>
            <span className="mx-1.5">•</span>
            <span>{team}</span>
            {owner && !available && (
              <>
                <span className="mx-1.5">•</span>
                <span className="text-hockey-light-slate">{owner}</span>
              </>
            )}
          </div>
        </div>
        {stats && (position !== 'G' ? stats.points !== undefined : stats.wins !== undefined) && (
          <div className="text-right">
            {position !== 'G' ? (
              <>
                <div className="text-sm font-semibold text-hockey-slate">{stats.points} pts</div>
                <div className="text-xs text-hockey-light-slate">
                  {stats.goals || 0}G, {stats.assists || 0}A
                </div>
              </>
            ) : (
              <>
                <div className="text-sm font-semibold text-hockey-slate">{stats.wins}-{stats.losses}-0</div>
                <div className="text-xs text-hockey-light-slate">
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
    <div className={cn("rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden hover-card", className)}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-lg bg-hockey-ice/50 flex items-center justify-center mr-4 overflow-hidden">
              {image ? (
                <img src={image} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl text-hockey-blue font-semibold">{name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-medium text-hockey-slate flex items-center gap-2">
                {name}
                {number && <span className="text-sm text-hockey-light-slate">#{number}</span>}
                <div className={cn("ml-2 h-2.5 w-2.5 rounded-full", statusColors[status])} title={status}></div>
              </h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-hockey-light-slate">
                <span className={cn("px-2 py-0.5 rounded-md border", getPositionColor())}>{position}</span>
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
