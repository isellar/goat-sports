import { describe, it, expect } from 'vitest';
import {
  calculateSkaterFantasyPoints,
  calculateGoalieFantasyPoints,
  calculateFantasyPoints,
  calculateFantasyPointsPerGame,
  estimateGamesPlayed,
} from './fantasy';
import { mockSkater, mockGoalie, mockPlayerWithZeroStats, mockPlayerWithNegativePlusMinus } from '../../__tests__/mocks/players';

describe('Fantasy Points Calculations', () => {
  describe('calculateSkaterFantasyPoints', () => {
    it('should calculate points for forward with goals and assists', () => {
      const player = mockSkater;
      // Goals: 50 * 3 = 150
      // Assists: 70 * 2 = 140
      // Plus/Minus: 15 * 0.5 = 7.5
      // Total: 150 + 140 + 7.5 = 297.5
      const points = calculateSkaterFantasyPoints(player);
      expect(points).toBe(297.5);
    });

    it('should calculate points for defenseman', () => {
      const player = { ...mockSkater, position: 'D' as const };
      const points = calculateSkaterFantasyPoints(player);
      expect(points).toBe(297.5);
    });

    it('should handle zero stats correctly', () => {
      const points = calculateSkaterFantasyPoints(mockPlayerWithZeroStats);
      expect(points).toBe(0);
    });

    it('should handle null/undefined stats', () => {
      const player = {
        ...mockSkater,
        goals: null,
        assists: undefined,
        plusMinus: null,
      };
      const points = calculateSkaterFantasyPoints(player);
      expect(points).toBe(0);
    });

    it('should verify scoring formula (Goals: 3pts, Assists: 2pts, +/-: 0.5pts)', () => {
      const player = {
        ...mockSkater,
        goals: 10,
        assists: 15,
        plusMinus: 5,
      };
      // 10 * 3 + 15 * 2 + 5 * 0.5 = 30 + 30 + 2.5 = 62.5
      const points = calculateSkaterFantasyPoints(player);
      expect(points).toBe(62.5);
    });

    it('should handle negative plus/minus', () => {
      const points = calculateSkaterFantasyPoints(mockPlayerWithNegativePlusMinus);
      // Goals: 50 * 3 = 150
      // Assists: 70 * 2 = 140
      // Plus/Minus: -10 * 0.5 = -5
      // Total: 150 + 140 - 5 = 285
      expect(points).toBe(285);
    });

    it('should handle zero goals', () => {
      const player = {
        ...mockSkater,
        goals: 0,
        assists: 10,
        plusMinus: 5,
      };
      // 0 * 3 + 10 * 2 + 5 * 0.5 = 0 + 20 + 2.5 = 22.5
      const points = calculateSkaterFantasyPoints(player);
      expect(points).toBe(22.5);
    });
  });

  describe('calculateGoalieFantasyPoints', () => {
    it('should calculate points for goalie with wins/losses', () => {
      const player = mockGoalie;
      // Wins: 30 * 3 = 90
      // Losses: 10 * -1 = -10
      // Shutouts: 5 * 2 = 10
      // Total: 90 - 10 + 10 = 90
      const points = calculateGoalieFantasyPoints(player);
      expect(points).toBe(90);
    });

    it('should calculate shutout bonus', () => {
      const player = {
        ...mockGoalie,
        wins: 5,
        losses: 0,
        shutouts: 3,
      };
      // 5 * 3 + 0 * -1 + 3 * 2 = 15 + 0 + 6 = 21
      const points = calculateGoalieFantasyPoints(player);
      expect(points).toBe(21);
    });

    it('should handle zero stats correctly', () => {
      const player = {
        ...mockGoalie,
        wins: 0,
        losses: 0,
        shutouts: 0,
      };
      const points = calculateGoalieFantasyPoints(player);
      expect(points).toBe(0);
    });

    it('should verify scoring formula (Win: 3pts, Loss: -1pt, Shutout: 2pts)', () => {
      const player = {
        ...mockGoalie,
        wins: 10,
        losses: 5,
        shutouts: 2,
      };
      // 10 * 3 + 5 * -1 + 2 * 2 = 30 - 5 + 4 = 29
      const points = calculateGoalieFantasyPoints(player);
      expect(points).toBe(29);
    });

    it('should handle all losses', () => {
      const player = {
        ...mockGoalie,
        wins: 0,
        losses: 10,
        shutouts: 0,
      };
      // 0 * 3 + 10 * -1 + 0 * 2 = -10
      const points = calculateGoalieFantasyPoints(player);
      expect(points).toBe(-10);
    });

    it('should handle all wins', () => {
      const player = {
        ...mockGoalie,
        wins: 10,
        losses: 0,
        shutouts: 0,
      };
      // 10 * 3 + 0 * -1 + 0 * 2 = 30
      const points = calculateGoalieFantasyPoints(player);
      expect(points).toBe(30);
    });
  });

  describe('calculateFantasyPoints', () => {
    it('should calculate points for skater', () => {
      const points = calculateFantasyPoints(mockSkater);
      expect(points).toBe(297.5);
    });

    it('should calculate points for goalie', () => {
      const points = calculateFantasyPoints(mockGoalie);
      expect(points).toBe(90);
    });

    it('should handle forward position', () => {
      const player = { ...mockSkater, position: 'LW' as const };
      const points = calculateFantasyPoints(player);
      expect(points).toBe(297.5);
    });

    it('should handle defenseman position', () => {
      const player = { ...mockSkater, position: 'D' as const };
      const points = calculateFantasyPoints(player);
      expect(points).toBe(297.5);
    });
  });

  describe('calculateFantasyPointsPerGame', () => {
    it('should calculate FP/G for skater with known games played', () => {
      const player = mockSkater;
      const gamesPlayed = 82;
      const fp = calculateFantasyPoints(player); // 297.5
      const expected = fp / gamesPlayed;
      const result = calculateFantasyPointsPerGame(player, gamesPlayed);
      expect(result).toBeCloseTo(expected, 2);
    });

    it('should calculate FP/G for goalie', () => {
      const player = mockGoalie;
      const gamesPlayed = 40; // wins + losses = 30 + 10
      const fp = calculateFantasyPoints(player); // 90
      const expected = fp / gamesPlayed;
      const result = calculateFantasyPointsPerGame(player, gamesPlayed);
      expect(result).toBeCloseTo(expected, 2);
    });

    it('should handle zero games played (should return 0)', () => {
      const player = mockPlayerWithZeroStats;
      const result = calculateFantasyPointsPerGame(player, 0);
      expect(result).toBe(0);
    });

    it('should use estimated games played when not provided', () => {
      const player = mockGoalie;
      // estimateGamesPlayed should return wins + losses = 30 + 10 = 40
      const result = calculateFantasyPointsPerGame(player);
      const expected = 90 / 40; // 2.25
      expect(result).toBeCloseTo(expected, 2);
    });

    it('should test division by zero protection', () => {
      const player = {
        ...mockSkater,
        goals: 0,
        assists: 0,
        points: 0,
      };
      const result = calculateFantasyPointsPerGame(player, 0);
      expect(result).toBe(0);
    });
  });

  describe('estimateGamesPlayed', () => {
    it('should estimate GP for goalie (wins + losses)', () => {
      const player = mockGoalie;
      const gp = estimateGamesPlayed(player);
      expect(gp).toBe(40); // 30 wins + 10 losses
    });

    it('should estimate GP for skater with points', () => {
      const player = mockSkater;
      const gp = estimateGamesPlayed(player);
      // Rough estimate based on points
      expect(gp).toBeGreaterThan(0);
    });

    it('should handle zero stats (should return 0)', () => {
      const player = mockPlayerWithZeroStats;
      const gp = estimateGamesPlayed(player);
      expect(gp).toBe(0);
    });

    it('should handle goalie with no wins or losses', () => {
      const player = {
        ...mockGoalie,
        wins: 0,
        losses: 0,
      };
      const gp = estimateGamesPlayed(player);
      expect(gp).toBe(0);
    });
  });
});
