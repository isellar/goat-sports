/**
 * Draft utility functions for generating draft order and managing draft logic
 */

import type { FantasyTeam } from '@/lib/db/schema';

/**
 * Generate snake draft order
 * @param teams Array of fantasy teams
 * @param rounds Number of rounds (default: roster size)
 * @returns Array of team IDs in draft order
 */
export function generateSnakeDraftOrder(
  teams: FantasyTeam[],
  rounds: number = 20
): string[] {
  if (teams.length === 0) return [];

  const teamIds = teams.map((t) => t.id);
  const order: string[] = [];

  for (let round = 0; round < rounds; round++) {
    const isReversed = round % 2 === 1; // Reverse order on odd rounds
    const roundOrder = isReversed ? [...teamIds].reverse() : [...teamIds];
    order.push(...roundOrder);
  }

  return order;
}

/**
 * Generate random draft order (for snake draft start)
 * @param teams Array of fantasy teams
 * @returns Shuffled array of team IDs
 */
export function shuffleDraftOrder(teams: FantasyTeam[]): FantasyTeam[] {
  const shuffled = [...teams];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get the team ID for a specific pick number in snake draft
 * @param draftOrder Array of team IDs in draft order
 * @param pickNumber Pick number (1-indexed)
 * @returns Team ID for this pick
 */
export function getTeamForPick(draftOrder: string[], pickNumber: number): string | null {
  if (pickNumber < 1 || pickNumber > draftOrder.length) {
    return null;
  }
  return draftOrder[pickNumber - 1];
}

/**
 * Calculate total number of picks in a draft
 * @param numTeams Number of teams
 * @param rosterSize Roster size per team
 * @returns Total number of picks
 */
export function calculateTotalPicks(numTeams: number, rosterSize: number): number {
  return numTeams * rosterSize;
}

/**
 * Get current round number from pick number
 * @param pickNumber Current pick number (1-indexed)
 * @param numTeams Number of teams
 * @returns Round number (1-indexed)
 */
export function getRoundNumber(pickNumber: number, numTeams: number): number {
  return Math.ceil(pickNumber / numTeams);
}

/**
 * Check if it's the last pick of a round (for snake draft reversal)
 * @param pickNumber Current pick number (1-indexed)
 * @param numTeams Number of teams
 * @returns True if this is the last pick of a round
 */
export function isLastPickOfRound(pickNumber: number, numTeams: number): boolean {
  return pickNumber % numTeams === 0;
}
