import { describe, it, expect } from 'vitest';
import {
  calculateTeamFantasyPoints,
  calculateWinPercentage,
  formatWinPercentage,
  getRankSuffix,
} from './standings';
import type { Player } from '@/lib/db/schema';

describe('standings utilities', () => {
  describe('calculateTeamFantasyPoints', () => {
    it('should calculate total fantasy points for a roster', () => {
      const roster: Player[] = [
        {
          id: 'player1',
          name: 'Player 1',
          position: 'C',
          goals: 10,
          assists: 15,
          plusMinus: 5,
        } as Player,
        {
          id: 'player2',
          name: 'Player 2',
          position: 'LW',
          goals: 5,
          assists: 10,
          plusMinus: -2,
        } as Player,
      ];

      // Player 1: 10*3 + 15*2 + 5*0.5 = 30 + 30 + 2.5 = 62.5
      // Player 2: 5*3 + 10*2 + (-2)*0.5 = 15 + 20 - 1 = 34
      // Total: 96.5
      const result = calculateTeamFantasyPoints(roster);
      expect(result).toBe(96.5);
    });

    it('should return 0 for empty roster', () => {
      const result = calculateTeamFantasyPoints([]);
      expect(result).toBe(0);
    });

    it('should handle goalies correctly', () => {
      const roster: Player[] = [
        {
          id: 'goalie1',
          name: 'Goalie 1',
          position: 'G',
          wins: 5,
          losses: 2,
          shutouts: 1,
        } as Player,
      ];

      // Goalie: 5*3 + 2*(-1) + 1*2 = 15 - 2 + 2 = 15
      const result = calculateTeamFantasyPoints(roster);
      expect(result).toBe(15);
    });

    it('should handle null/undefined stats', () => {
      const roster: Player[] = [
        {
          id: 'player1',
          name: 'Player 1',
          position: 'C',
          goals: null as any,
          assists: undefined as any,
          plusMinus: 0,
        } as Player,
      ];

      const result = calculateTeamFantasyPoints(roster);
      expect(result).toBe(0);
    });
  });

  describe('calculateWinPercentage', () => {
    it('should calculate win percentage correctly', () => {
      expect(calculateWinPercentage(10, 5, 0)).toBe(10 / 15);
      expect(calculateWinPercentage(8, 2, 0)).toBe(0.8);
      expect(calculateWinPercentage(5, 5, 0)).toBe(0.5);
    });

    it('should handle ties', () => {
      expect(calculateWinPercentage(10, 5, 5)).toBe(10 / 20);
      expect(calculateWinPercentage(8, 2, 2)).toBe(8 / 12);
    });

    it('should return 0 when no games played', () => {
      expect(calculateWinPercentage(0, 0, 0)).toBe(0);
    });

    it('should handle default ties parameter', () => {
      expect(calculateWinPercentage(10, 5)).toBe(10 / 15);
    });
  });

  describe('formatWinPercentage', () => {
    it('should format win percentage as percentage string', () => {
      expect(formatWinPercentage(0.5)).toBe('50.0');
      expect(formatWinPercentage(0.666)).toBe('66.6');
      expect(formatWinPercentage(0.0)).toBe('0.0');
      expect(formatWinPercentage(1.0)).toBe('100.0');
    });

    it('should handle decimal precision', () => {
      expect(formatWinPercentage(0.333333)).toBe('33.3');
      expect(formatWinPercentage(0.666666)).toBe('66.7');
    });
  });

  describe('getRankSuffix', () => {
    it('should return correct suffix for 1st, 2nd, 3rd', () => {
      expect(getRankSuffix(1)).toBe('1st');
      expect(getRankSuffix(2)).toBe('2nd');
      expect(getRankSuffix(3)).toBe('3rd');
    });

    it('should return "th" for 4-9', () => {
      expect(getRankSuffix(4)).toBe('4th');
      expect(getRankSuffix(5)).toBe('5th');
      expect(getRankSuffix(9)).toBe('9th');
    });

    it('should handle teens correctly (11th, 12th, 13th)', () => {
      expect(getRankSuffix(11)).toBe('11th');
      expect(getRankSuffix(12)).toBe('12th');
      expect(getRankSuffix(13)).toBe('13th');
    });

    it('should handle 21st, 22nd, 23rd correctly', () => {
      expect(getRankSuffix(21)).toBe('21st');
      expect(getRankSuffix(22)).toBe('22nd');
      expect(getRankSuffix(23)).toBe('23rd');
    });

    it('should handle larger numbers', () => {
      expect(getRankSuffix(100)).toBe('100th');
      expect(getRankSuffix(101)).toBe('101st');
      expect(getRankSuffix(102)).toBe('102nd');
      expect(getRankSuffix(103)).toBe('103rd');
    });
  });
});
