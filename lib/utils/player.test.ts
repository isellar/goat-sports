import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  calculateAge,
  isInNextSlate,
  formatGameDateTime,
} from './player';

describe('Player Utilities', () => {
  describe('calculateAge', () => {
    it('should calculate age from date of birth', () => {
      const birthDate = new Date('1997-01-13');
      const age = calculateAge(birthDate);
      // Age should be approximately 27-28 depending on current date
      expect(age).toBeGreaterThan(25);
      expect(age).toBeLessThan(30);
    });

    it('should calculate age from string date', () => {
      const birthDate = '1997-01-13';
      const age = calculateAge(birthDate);
      expect(age).toBeGreaterThan(25);
      expect(age).toBeLessThan(30);
    });

    it('should handle null date of birth', () => {
      const age = calculateAge(null);
      expect(age).toBeNull();
    });

    it('should handle undefined date of birth', () => {
      const age = calculateAge(undefined);
      expect(age).toBeNull();
    });

    it('should handle future dates (edge case)', () => {
      const futureDate = new Date('2030-01-01');
      const age = calculateAge(futureDate);
      // Should still calculate, but result will be negative or very small
      expect(age).toBeLessThan(0);
    });

    it('should handle leap years', () => {
      const leapYearBirth = new Date('2000-02-29');
      const age = calculateAge(leapYearBirth);
      expect(age).toBeGreaterThan(20);
      expect(age).toBeLessThan(30);
    });

    it('should handle invalid date strings', () => {
      const age = calculateAge('invalid-date');
      expect(age).toBeNull();
    });
  });

  describe('isInNextSlate', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should identify games in next slate (today)', () => {
      const today = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(today);
      
      const gameDate = new Date('2024-01-15T20:00:00Z');
      const result = isInNextSlate(gameDate);
      expect(result).toBe(true);
    });

    it('should identify games in next slate (tomorrow)', () => {
      const today = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(today);
      
      const gameDate = new Date('2024-01-16T20:00:00Z');
      const result = isInNextSlate(gameDate);
      expect(result).toBe(true);
    });

    it('should handle games outside slate window', () => {
      const today = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(today);
      
      const gameDate = new Date('2024-01-17T20:00:00Z');
      const result = isInNextSlate(gameDate);
      expect(result).toBe(false);
    });

    it('should handle past games', () => {
      const today = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(today);
      
      const gameDate = new Date('2024-01-14T20:00:00Z');
      const result = isInNextSlate(gameDate);
      expect(result).toBe(false);
    });

    it('should handle timezone edge cases', () => {
      const today = new Date('2024-01-15T23:00:00Z');
      vi.setSystemTime(today);
      
      // Game tomorrow at 1 AM
      const gameDate = new Date('2024-01-16T01:00:00Z');
      const result = isInNextSlate(gameDate);
      expect(result).toBe(true);
    });

    it('should handle null game date', () => {
      const result = isInNextSlate(null);
      expect(result).toBe(false);
    });

    it('should handle invalid date strings', () => {
      const result = isInNextSlate('invalid-date');
      expect(result).toBe(false);
    });

    it('should handle string dates', () => {
      const today = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(today);
      
      const gameDate = '2024-01-15T20:00:00Z';
      const result = isInNextSlate(gameDate);
      expect(result).toBe(true);
    });
  });

  describe('formatGameDateTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should format game dates correctly', () => {
      const today = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(today);
      
      const gameDate = new Date('2024-01-20T20:00:00Z');
      const result = formatGameDateTime(gameDate);
      expect(result).toContain('Jan');
      expect(result).toContain('20');
    });

    it('should format relative dates (today)', () => {
      const today = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(today);
      
      const gameDate = new Date('2024-01-15T20:00:00Z');
      const result = formatGameDateTime(gameDate);
      expect(result).toContain('Today');
    });

    it('should format relative dates (tomorrow)', () => {
      const today = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(today);
      
      const gameDate = new Date('2024-01-16T20:00:00Z');
      const result = formatGameDateTime(gameDate);
      expect(result).toContain('Tomorrow');
    });

    it('should handle timezone conversions', () => {
      const today = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(today);
      
      const gameDate = new Date('2024-01-15T18:00:00Z');
      const result = formatGameDateTime(gameDate);
      expect(result).toContain('Today');
    });

    it('should handle null game date', () => {
      const result = formatGameDateTime(null);
      expect(result).toBe('-');
    });

    it('should handle invalid date strings', () => {
      const result = formatGameDateTime('invalid-date');
      expect(result).toBe('-');
    });

    it('should handle string dates', () => {
      const today = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(today);
      
      const gameDate = '2024-01-20T20:00:00Z';
      const result = formatGameDateTime(gameDate);
      expect(result).toContain('Jan');
    });
  });
});
