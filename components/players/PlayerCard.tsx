import { Badge } from '@/components/ui/badge';
import type { Player, Team } from '@/lib/db/schema';
import { calculateAge } from '@/lib/utils/player';
import { cn } from '@/lib/utils';

interface PlayerCardProps {
  player: Player;
  team: Team | null;
}

// Map status to display text and gradient color
function getStatusDisplay(status: string | null | undefined): { text: string; gradientColor: string; badgeColor: string; textColor: string } {
  const s = (status || 'healthy').toLowerCase();
  
  if (s === 'dtd' || s === 'day-to-day' || s === 'questionable') {
    return { 
      text: 'DTD', 
      gradientColor: 'from-yellow-500/20 to-transparent',
      badgeColor: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
      textColor: 'text-yellow-700 dark:text-yellow-400'
    };
  }
  if (s === 'ir' || s === 'injured reserve' || s === 'injured' || s === 'out') {
    return { 
      text: 'IR', 
      gradientColor: 'from-red-500/20 to-transparent',
      badgeColor: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
      textColor: 'text-red-700 dark:text-red-400'
    };
  }
  if (s === 'minors') {
    return { 
      text: 'Minors', 
      gradientColor: 'from-yellow-500/20 to-transparent',
      badgeColor: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
      textColor: 'text-yellow-700 dark:text-yellow-400'
    };
  }
  // Healthy or unknown - no gradient
  return { text: '', gradientColor: '', badgeColor: '', textColor: '' };
}

export function PlayerCard({ player, team }: PlayerCardProps) {
  const age = calculateAge(player.dateOfBirth);
  const statusDisplay = getStatusDisplay(player.status);
  const hasStatus = statusDisplay.text !== '';

  return (
    <div className="flex items-center gap-2 w-[190px] py-0.5 relative overflow-hidden rounded-sm">
      {/* Gradient overlay - extends beyond badge with padding matching py-0.5 (0.125rem) */}
      {hasStatus && (
        <div 
          className={cn(
            'absolute right-0 bg-gradient-to-l',
            statusDisplay.gradientColor
          )}
          style={{ 
            top: '0.125rem', // Match py-0.5 padding
            bottom: '0.125rem', // Match py-0.5 padding
            width: '4rem', // Approximate badge width + gap + padding
          }}
        />
      )}
      
      {/* Player Info */}
      <div className="flex-1 min-w-0 z-10">
        {/* Name with Jersey Number */}
        <div className="flex items-center gap-1.5 leading-tight">
          <span className="font-semibold text-sm truncate">
            {player.name}
          </span>
          {player.jerseyNumber && (
            <span className="text-xs text-muted-foreground font-mono shrink-0">
              #{player.jerseyNumber}
            </span>
          )}
        </div>
        
        {/* Position, Team, Age row */}
        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
          {/* Position Badge */}
          <Badge 
            variant="outline" 
            className="text-[10px] px-1.5 py-0 h-3.5 font-mono font-semibold border-muted-foreground/30"
          >
            {player.position}
          </Badge>
          
          {/* Dot */}
          <span className="text-[10px] text-muted-foreground/60">•</span>
          
          {/* Team */}
          {team && (
            <span className="text-[11px] font-semibold text-foreground">
              {team.abbreviation}
            </span>
          )}
          
          {/* Age */}
          {age !== null && (
            <>
              <span className="text-[10px] text-muted-foreground/60">•</span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {age}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Status Badge - larger, on the right, only if not healthy */}
      {hasStatus && (
        <div className="text-xs px-2 py-0.5 h-6 shrink-0 font-semibold z-10 mr-0.5 flex items-center">
          <span className={cn('font-semibold', statusDisplay.textColor)}>
            {statusDisplay.text}
          </span>
        </div>
      )}
    </div>
  );
}

