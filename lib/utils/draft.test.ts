import { describe, it, expect } from 'vitest';
import {
  generateSnakeDraftOrder,
  shuffleDraftOrder,
  getTeamForPick,
  calculateTotalPicks,
  getRoundNumber,
  isLastPickOfRound,
} from './draft';
import type { FantasyTeam } from '@/lib/db/schema';

const mockTeams: FantasyTeam[] = [
  { id: 'team_1', leagueId: 'league_1', ownerId: 'user_1', name: 'Team 1', createdAt: new Date(), updatedAt: new Date() },
  { id: 'team_2', leagueId: 'league_1', ownerId: 'user_2', name: 'Team 2', createdAt: new Date(), updatedAt: new Date() },
  { id: 'team_3', leagueId: 'league_1', ownerId: 'user_3', name: 'Team 3', createdAt: new Date(), updatedAt: new Date() },
];

describe('Draft Utilities', () => {
  describe('generateSnakeDraftOrder', () => {
    it('should generate correct snake draft order for 2 rounds', () => {
      const order = generateSnakeDraftOrder(mockTeams, 2);
      
      // Round 1: team_1, team_2, team_3
      // Round 2: team_3, team_2, team_1 (reversed)
      expect(order).toEqual(['team_1', 'team_2', 'team_3', 'team_3', 'team_2', 'team_1']);
    });

    it('should generate correct snake draft order for 3 rounds', () => {
      const order = generateSnakeDraftOrder(mockTeams, 3);
      
      // Round 1: team_1, team_2, team_3
      // Round 2: team_3, team_2, team_1 (reversed)
      // Round 3: team_1, team_2, team_3
      expect(order.length).toBe(9);
      expect(order[0]).toBe('team_1');
      expect(order[3]).toBe('team_3'); // First pick of round 2 (reversed)
      expect(order[6]).toBe('team_1'); // First pick of round 3
    });

    it('should return empty array for empty teams', () => {
      const order = generateSnakeDraftOrder([], 2);
      expect(order).toEqual([]);
    });

    it('should handle single team', () => {
      const order = generateSnakeDraftOrder([mockTeams[0]], 2);
      expect(order).toEqual(['team_1', 'team_1']);
    });
  });

  describe('shuffleDraftOrder', () => {
    it('should return same number of teams', () => {
      const shuffled = shuffleDraftOrder(mockTeams);
      expect(shuffled.length).toBe(mockTeams.length);
    });

    it('should contain all team IDs', () => {
      const shuffled = shuffleDraftOrder(mockTeams);
      const shuffledIds = shuffled.map((t) => t.id);
      const originalIds = mockTeams.map((t) => t.id);
      
      expect(shuffledIds.sort()).toEqual(originalIds.sort());
    });

    it('should return empty array for empty input', () => {
      const shuffled = shuffleDraftOrder([]);
      expect(shuffled).toEqual([]);
    });
  });

  describe('getTeamForPick', () => {
    const draftOrder = ['team_1', 'team_2', 'team_3', 'team_3', 'team_2', 'team_1'];

    it('should return correct team for pick 1', () => {
      expect(getTeamForPick(draftOrder, 1)).toBe('team_1');
    });

    it('should return correct team for pick 3', () => {
      expect(getTeamForPick(draftOrder, 3)).toBe('team_3');
    });

    it('should return correct team for pick 4 (reversed round)', () => {
      expect(getTeamForPick(draftOrder, 4)).toBe('team_3');
    });

    it('should return null for pick 0', () => {
      expect(getTeamForPick(draftOrder, 0)).toBeNull();
    });

    it('should return null for pick beyond array length', () => {
      expect(getTeamForPick(draftOrder, 100)).toBeNull();
    });
  });

  describe('calculateTotalPicks', () => {
    it('should calculate total picks correctly', () => {
      expect(calculateTotalPicks(12, 20)).toBe(240);
      expect(calculateTotalPicks(10, 15)).toBe(150);
      expect(calculateTotalPicks(8, 18)).toBe(144);
    });

    it('should handle zero teams', () => {
      expect(calculateTotalPicks(0, 20)).toBe(0);
    });

    it('should handle zero roster size', () => {
      expect(calculateTotalPicks(12, 0)).toBe(0);
    });
  });

  describe('getRoundNumber', () => {
    it('should return correct round number', () => {
      expect(getRoundNumber(1, 12)).toBe(1);
      expect(getRoundNumber(12, 12)).toBe(1);
      expect(getRoundNumber(13, 12)).toBe(2);
      expect(getRoundNumber(24, 12)).toBe(2);
      expect(getRoundNumber(25, 12)).toBe(3);
    });

    it('should handle edge cases', () => {
      expect(getRoundNumber(1, 1)).toBe(1);
      expect(getRoundNumber(5, 5)).toBe(1);
    });
  });

  describe('isLastPickOfRound', () => {
    it('should return true for last pick of round', () => {
      expect(isLastPickOfRound(12, 12)).toBe(true);
      expect(isLastPickOfRound(24, 12)).toBe(true);
      expect(isLastPickOfRound(36, 12)).toBe(true);
    });

    it('should return false for non-last picks', () => {
      expect(isLastPickOfRound(1, 12)).toBe(false);
      expect(isLastPickOfRound(11, 12)).toBe(false);
      expect(isLastPickOfRound(13, 12)).toBe(false);
    });
  });
});
