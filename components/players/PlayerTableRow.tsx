'use client';

import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import type { Player, Team, Game } from '@/lib/db/schema';
import {
  calculateFantasyPoints,
  calculateFantasyPointsPerGame,
  estimateGamesPlayed,
} from '@/lib/utils/fantasy';
import { isInNextSlate, formatGameDateTime } from '@/lib/utils/player';
import { PlayerCard } from './PlayerCard';
import { PlayerStatsModal } from './PlayerStatsModal';
import { HeatScore } from './HeatScore';
import { TrendScore } from './TrendScore';
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
  const [modalOpen, setModalOpen] = useState(false);
  const fantasyPoints = calculateFantasyPoints(player);
  const gamesPlayed = estimateGamesPlayed(player);
  const fantasyPointsPerGame = calculateFantasyPointsPerGame(player, gamesPlayed);
  
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
    <>
      <TableRow className="hover:bg-muted/50">
        {/* Player Card - consolidates Name, Position, Team, Age, Status */}
        <TableCell className="py-1.5 w-[190px]">
          <PlayerCard 
            player={player} 
            team={player.team}
          />
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

        {/* Position Rank */}
        <TableCell className="text-right">
          {player.positionRank !== null && player.positionRank !== undefined ? (
            <span className="font-medium">#{player.positionRank}</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </TableCell>

        {/* Position Rank Last 10 */}
        <TableCell className="text-right">
          {player.positionRankLast10 !== null && player.positionRankLast10 !== undefined ? (
            <span className="font-medium">#{player.positionRankLast10}</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </TableCell>

        {/* Heat Score */}
        <TableCell className="text-center">
          <HeatScore score={player.heatScore} />
        </TableCell>

        {/* Trend Score */}
        <TableCell className="text-center">
          <TrendScore score={player.trendScore} />
        </TableCell>

        {/* Expand Button */}
        <TableCell className="text-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setModalOpen(true)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      <PlayerStatsModal
        player={player}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
