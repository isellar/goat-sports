import type { Player } from '@/lib/db/schema';
import { calculateFantasyPoints } from './fantasy';

export interface TeamStandingStats {
  totalFantasyPoints: number;
  rosterSize: number;
  wins: number;
  losses: number;
  ties: number;
  winPercentage: number;
}

/**
 * Calculate total fantasy points for a roster of players
 */
export function calculateTeamFantasyPoints(rosterPlayers: Player[]): number {
  return rosterPlayers.reduce((total, player) => {
    return total + calculateFantasyPoints(player);
  }, 0);
}

/**
 * Calculate win percentage
 */
export function calculateWinPercentage(
  wins: number,
  losses: number,
  ties: number = 0
): number {
  const totalGames = wins + losses + ties;
  if (totalGames === 0) return 0;
  return wins / totalGames;
}

/**
 * Format win percentage for display
 */
export function formatWinPercentage(winPercentage: number): string {
  return (winPercentage * 100).toFixed(1);
}

/**
 * Get rank suffix (1st, 2nd, 3rd, etc.)
 */
export function getRankSuffix(rank: number): string {
  const lastDigit = rank % 10;
  const lastTwoDigits = rank % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${rank}th`;
  }

  switch (lastDigit) {
    case 1:
      return `${rank}st`;
    case 2:
      return `${rank}nd`;
    case 3:
      return `${rank}rd`;
    default:
      return `${rank}th`;
  }
}
