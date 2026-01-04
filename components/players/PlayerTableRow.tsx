import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Player, Team, Game } from '@/lib/db/schema';
import {
  calculateFantasyPoints,
  calculateFantasyPointsPerGame,
  estimateGamesPlayed,
} from '@/lib/utils/fantasy';
import { calculateAge, isInNextSlate, formatGameDateTime } from '@/lib/utils/player';
import { cn } from '@/lib/utils';

interface PlayerWithTeam extends Player {
  team: Team | null;
  nextGame?: Game & {
    homeTeam?: Team | null;
    awayTeam?: Team | null;
  } | null;
}

interface PlayerTableRowProps {
  player: PlayerWithTeam;
  getStatusColor: (status: string) => string;
}

export function PlayerTableRow({ player, getStatusColor }: PlayerTableRowProps) {
  const isGoalie = player.position === 'G';
  const fantasyPoints = calculateFantasyPoints(player);
  const gamesPlayed = estimateGamesPlayed(player);
  const fantasyPointsPerGame = calculateFantasyPointsPerGame(player, gamesPlayed);
  const age = calculateAge(player.dateOfBirth);
  
  // Determine next opponent
  let nextOpponent: Team | null = null;
  let nextGameDate: Date | null = null;
  let isNextSlate = false;
  
  if (player.nextGame && player.team) {
    const game = player.nextGame;
    // Determine opponent based on which team the player is on
    if (game.homeTeam?.id === player.team.id) {
      nextOpponent = game.awayTeam || null;
    } else if (game.awayTeam?.id === player.team.id) {
      nextOpponent = game.homeTeam || null;
    }
    
    if (game.gameDate) {
      nextGameDate = typeof game.gameDate === 'string' ? new Date(game.gameDate) : game.gameDate;
      isNextSlate = isInNextSlate(nextGameDate);
    }
  }

  return (
    <TableRow className="hover:bg-muted/50">
      {/* Name */}
      <TableCell className="font-medium">{player.name}</TableCell>

      {/* Position */}
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {player.position}
        </Badge>
      </TableCell>

      {/* Team - just abbreviation */}
      <TableCell>
        {player.team ? (
          <span className="font-medium">{player.team.abbreviation}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>

      {/* Age */}
      <TableCell className="text-right">
        {age !== null ? age : '-'}
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant="outline" className={cn('text-xs', getStatusColor(player.status || 'healthy'))}>
          {(player.status || 'healthy').charAt(0).toUpperCase() +
            (player.status || 'healthy').slice(1)}
        </Badge>
      </TableCell>

      {/* Next Opponent */}
      <TableCell>
        {nextOpponent ? (
          <div className={cn('flex flex-col', isNextSlate && 'font-semibold text-blue-600 dark:text-blue-400')}>
            <span>{nextOpponent.abbreviation}</span>
            {nextGameDate && (
              <span className={cn('text-xs', isNextSlate ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground')}>
                {formatGameDateTime(nextGameDate)}
              </span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>

      {/* Games Played */}
      <TableCell className="text-right">{gamesPlayed || '-'}</TableCell>

      {/* Fantasy Points - Prominent */}
      <TableCell className="text-right font-semibold text-orange-600 dark:text-orange-400">
        {fantasyPoints.toFixed(2)}
      </TableCell>

      {/* Fantasy Points Per Game - Prominent */}
      <TableCell className="text-right font-semibold text-orange-600 dark:text-orange-400">
        {gamesPlayed > 0 ? fantasyPointsPerGame.toFixed(2) : '-'}
      </TableCell>

      {/* Skater Stats (shown for skaters, empty for goalies) */}
      <TableCell className="text-right">
        {!isGoalie ? (player.goals ?? 0) : '-'}
      </TableCell>
      <TableCell className="text-right">
        {!isGoalie ? (player.assists ?? 0) : '-'}
      </TableCell>
      <TableCell className="text-right">
        {!isGoalie ? (player.points ?? 0) : '-'}
      </TableCell>
      <TableCell className="text-right">
        {!isGoalie && player.plusMinus !== null && player.plusMinus !== undefined ? (
          <span
            className={cn(
              player.plusMinus > 0
                ? 'text-green-600 dark:text-green-400'
                : player.plusMinus < 0
                  ? 'text-red-600 dark:text-red-400'
                  : ''
            )}
          >
            {player.plusMinus > 0 ? '+' : ''}
            {player.plusMinus}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>

      {/* Goalie Stats (shown for goalies, empty for skaters) */}
      <TableCell className="text-right">
        {isGoalie ? (player.wins ?? 0) : '-'}
      </TableCell>
      <TableCell className="text-right">
        {isGoalie ? (player.losses ?? 0) : '-'}
      </TableCell>
      <TableCell className="text-right">
        {isGoalie ? (player.shutouts ?? 0) : '-'}
      </TableCell>
      <TableCell className="text-right">
        {isGoalie && player.savePercentage ? (
          <span>{(player.savePercentage / 1000).toFixed(3)}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
    </TableRow>
  );
}
