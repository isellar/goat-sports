import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, PATCH } from './route';
import { NextRequest } from 'next/server';
import { mockLeague, mockUser, mockLeagueMembership, mockFantasyTeam } from '../../../../__tests__/mocks/leagues';

// Mock the database module
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
}));

// Mock drizzle-orm functions
vi.mock('drizzle-orm', async (importOriginal) => {
  const actual = await importOriginal<typeof import('drizzle-orm')>();
  return {
    ...actual,
    eq: vi.fn((a, b) => ({ type: 'eq', left: a, right: b })),
    and: vi.fn((...args) => ({ type: 'and', conditions: args })),
  };
});

describe('/api/leagues/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET - Get League by ID', () => {
    it('should return league details', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([
          { league: mockLeague, commissioner: mockUser },
        ]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([
          { membership: mockLeagueMembership, user: mockUser },
        ]),
      } as any);
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([
          { team: mockFantasyTeam, owner: mockUser },
        ]),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/leagues/league-1');
      const response = await GET(request, { params: Promise.resolve({ id: 'league-1' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.league).toBeDefined();
      expect(data.league.id).toBe('league-1');
    });

    it('should include teams and members', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([
          { league: mockLeague, commissioner: mockUser },
        ]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([
          { membership: mockLeagueMembership, user: mockUser },
        ]),
      } as any);
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([
          { team: mockFantasyTeam, owner: mockUser },
        ]),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/leagues/league-1');
      const response = await GET(request, { params: Promise.resolve({ id: 'league-1' }) });
      const data = await response.json();

      expect(data.league).toHaveProperty('members');
      expect(data.league).toHaveProperty('teams');
      expect(Array.isArray(data.league.members)).toBe(true);
      expect(Array.isArray(data.league.teams)).toBe(true);
    });

    it('should handle non-existent league', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);

      const request = new NextRequest('http://localhost:3000/api/leagues/nonexistent');
      const response = await GET(request, { params: Promise.resolve({ id: 'nonexistent' }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('League not found');
    });
  });

  describe('PATCH - Update League', () => {
    it('should update league', async () => {
      const { db } = await import('@/lib/db');
      
      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{ ...mockLeague, name: 'Updated League' }]),
      };

      vi.mocked(db.update).mockReturnValueOnce(mockUpdate as any);

      const request = new NextRequest('http://localhost:3000/api/leagues/league-1', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Updated League' }),
      });

      const response = await PATCH(request, { params: Promise.resolve({ id: 'league-1' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.league.name).toBe('Updated League');
    });

    it('should handle non-existent league', async () => {
      const { db } = await import('@/lib/db');
      
      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(db.update).mockReturnValueOnce(mockUpdate as any);

      const request = new NextRequest('http://localhost:3000/api/leagues/nonexistent', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Updated League' }),
      });

      const response = await PATCH(request, { params: Promise.resolve({ id: 'nonexistent' }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('League not found');
    });
  });
});
