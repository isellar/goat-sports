import type { Player } from '@/lib/db/schema';

/**
 * Calculate fantasy points for a skater (forward or defenseman)
 * Standard fantasy scoring:
 * - Goals: 3 points
 * - Assists: 2 points
 * - Plus/Minus: 0.5 points per unit
 * - Shots on Goal: 0.5 points per shot
 * - Hits: 0.5 points per hit
 * - Blocks: 0.5 points per block
 */
export function calculateSkaterFantasyPoints(player: Player): number {
  const goals = (player.goals || 0) * 3;
  const assists = (player.assists || 0) * 2;
  const plusMinus = (player.plusMinus || 0) * 0.5;
  // Note: SOG, hits, blocks would be added here when available in schema
  return goals + assists + plusMinus;
}

/**
 * Calculate fantasy points for a goalie
 * Standard fantasy scoring:
 * - Win: 3 points
 * - Loss: -1 point
 * - Shutout: 2 points
 * - Save: 0.1 points per save
 * - Goal Against: -1 point per goal
 */
export function calculateGoalieFantasyPoints(player: Player): number {
  const wins = (player.wins || 0) * 3;
  const losses = (player.losses || 0) * -1;
  const shutouts = (player.shutouts || 0) * 2;
  // Note: Saves and goals against would be added here when available
  return wins + losses + shutouts;
}

/**
 * Calculate fantasy points for any player (skater or goalie)
 */
export function calculateFantasyPoints(player: Player): number {
  if (player.position === 'G') {
    return calculateGoalieFantasyPoints(player);
  }
  return calculateSkaterFantasyPoints(player);
}

/**
 * Calculate fantasy points per game
 * Uses games played if available, otherwise estimates
 */
export function calculateFantasyPointsPerGame(
  player: Player,
  gamesPlayed?: number
): number {
  const fp = calculateFantasyPoints(player);
  const gp = gamesPlayed || estimateGamesPlayed(player);
  if (gp === 0) return 0;
  return fp / gp;
}

/**
 * Estimate games played based on available stats
 * For goalies: wins + losses
 * For skaters: estimate based on points (rough heuristic)
 */
export function estimateGamesPlayed(player: Player): number {
  if (player.position === 'G') {
    return (player.wins || 0) + (player.losses || 0);
  }
  // For skaters, estimate based on points (most players with points have played games)
  // This is a rough estimate - ideally we'd have actual GP in the schema
  const points = player.points || 0;
  if (points > 0) {
    // Rough estimate: assume players with points have played at least some games
    // This will be replaced with actual GP when available
    return Math.max(1, Math.floor(points / 0.5)); // Very rough estimate
  }
  return 0;
}

