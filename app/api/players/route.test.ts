import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';
import { mockSkater, mockGoalie } from '../../../__tests__/mocks/players';
import { mockTeam } from '../../../__tests__/mocks/teams';
import { mockGame } from '../../../__tests__/mocks/games';

// Mock the database module
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
  },
}));

// Mock drizzle-orm functions
vi.mock('drizzle-orm', async (importOriginal) => {
  const actual = await importOriginal<typeof import('drizzle-orm')>();
  return {
    ...actual,
    eq: vi.fn((a, b) => ({ type: 'eq', left: a, right: b })),
    and: vi.fn((...args) => ({ type: 'and', conditions: args })),
    or: vi.fn((...args) => ({ type: 'or', conditions: args })),
    like: vi.fn((col, pattern) => ({ type: 'like', column: col, pattern })),
    sql: vi.fn((strings, ...values) => ({ type: 'sql', strings, values })),
    gt: vi.fn((col, value) => ({ type: 'gt', column: col, value })),
    inArray: vi.fn((col, values) => ({ type: 'inArray', column: col, values })),
  };
});

describe('/api/players', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET - Basic Functionality', () => {
    it('should return list of players', async () => {
      const { db } = await import('@/lib/db');
      
      // Mock the query chain
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([
          { player: mockSkater, team: mockTeam },
        ]),
      };

      const mockCountQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 1 }]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);
      vi.mocked(db.select).mockReturnValueOnce(mockCountQuery as any);

      // Mock games query
      const mockGamesQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.select).mockReturnValueOnce(mockGamesQuery as any);

      const request = new NextRequest('http://localhost:3000/api/players');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.players).toBeDefined();
      expect(Array.isArray(data.players)).toBe(true);
    });

    it('should return correct data structure', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([
          { player: mockSkater, team: mockTeam },
        ]),
      };

      const mockCountQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 1 }]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);
      vi.mocked(db.select).mockReturnValueOnce(mockCountQuery as any);

      const mockGamesQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.select).mockReturnValueOnce(mockGamesQuery as any);

      const request = new NextRequest('http://localhost:3000/api/players');
      const response = await GET(request);
      const data = await response.json();

      expect(data).toHaveProperty('players');
      expect(data).toHaveProperty('total');
      expect(data).toHaveProperty('limit');
      expect(data).toHaveProperty('offset');
    });

    it('should include team information', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([
          { player: mockSkater, team: mockTeam },
        ]),
      };

      const mockCountQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 1 }]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);
      vi.mocked(db.select).mockReturnValueOnce(mockCountQuery as any);

      const mockGamesQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.select).mockReturnValueOnce(mockGamesQuery as any);

      const request = new NextRequest('http://localhost:3000/api/players');
      const response = await GET(request);
      const data = await response.json();

      expect(data.players[0]).toHaveProperty('team');
    });

    it('should handle database not configured', async () => {
      // Mock db as null
      vi.doMock('@/lib/db', () => ({
        db: null,
      }));

      const request = new NextRequest('http://localhost:3000/api/players');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe('Database not configured');
    });
  });

  describe('GET - Search Functionality', () => {
    it('should search by player name (partial match)', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([
          { player: mockSkater, team: mockTeam },
        ]),
      };

      const mockCountQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 1 }]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);
      vi.mocked(db.select).mockReturnValueOnce(mockCountQuery as any);

      const mockGamesQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.select).mockReturnValueOnce(mockGamesQuery as any);

      const request = new NextRequest('http://localhost:3000/api/players?search=McDavid');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // Verify that where was called with search condition
      expect(mockQuery.where).toHaveBeenCalled();
    });

    it('should return empty array for no matches', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([]),
      };

      const mockCountQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 0 }]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);
      vi.mocked(db.select).mockReturnValueOnce(mockCountQuery as any);

      const mockGamesQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.select).mockReturnValueOnce(mockGamesQuery as any);

      const request = new NextRequest('http://localhost:3000/api/players?search=Nonexistent');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.players).toEqual([]);
      expect(data.total).toBe(0);
    });
  });

  describe('GET - Filtering', () => {
    it('should filter by position', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([
          { player: mockSkater, team: mockTeam },
        ]),
      };

      const mockCountQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 1 }]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);
      vi.mocked(db.select).mockReturnValueOnce(mockCountQuery as any);

      const mockGamesQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.select).mockReturnValueOnce(mockGamesQuery as any);

      const request = new NextRequest('http://localhost:3000/api/players?position=C');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockQuery.where).toHaveBeenCalled();
    });

    it('should filter by team ID', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([
          { player: mockSkater, team: mockTeam },
        ]),
      };

      const mockCountQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 1 }]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);
      vi.mocked(db.select).mockReturnValueOnce(mockCountQuery as any);

      const mockGamesQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.select).mockReturnValueOnce(mockGamesQuery as any);

      const request = new NextRequest('http://localhost:3000/api/players?teamId=team-1');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockQuery.where).toHaveBeenCalled();
    });

    it('should filter by minimum points', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([
          { player: mockSkater, team: mockTeam },
        ]),
      };

      const mockCountQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 1 }]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);
      vi.mocked(db.select).mockReturnValueOnce(mockCountQuery as any);

      const mockGamesQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.select).mockReturnValueOnce(mockGamesQuery as any);

      const request = new NextRequest('http://localhost:3000/api/players?minPoints=100');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockQuery.where).toHaveBeenCalled();
    });
  });

  describe('GET - Sorting', () => {
    it('should sort by name (ascending)', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([
          { player: mockSkater, team: mockTeam },
        ]),
      };

      const mockCountQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 1 }]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);
      vi.mocked(db.select).mockReturnValueOnce(mockCountQuery as any);

      const mockGamesQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.select).mockReturnValueOnce(mockGamesQuery as any);

      const request = new NextRequest('http://localhost:3000/api/players?sortBy=name&sortOrder=asc');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockQuery.orderBy).toHaveBeenCalled();
    });

    it('should sort by points (descending)', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([
          { player: mockSkater, team: mockTeam },
        ]),
      };

      const mockCountQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 1 }]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);
      vi.mocked(db.select).mockReturnValueOnce(mockCountQuery as any);

      const mockGamesQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.select).mockReturnValueOnce(mockGamesQuery as any);

      const request = new NextRequest('http://localhost:3000/api/players?sortBy=points&sortOrder=desc');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockQuery.orderBy).toHaveBeenCalled();
    });
  });

  describe('GET - Pagination', () => {
    it('should return correct limit of results', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([
          { player: mockSkater, team: mockTeam },
        ]),
      };

      const mockCountQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 1 }]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);
      vi.mocked(db.select).mockReturnValueOnce(mockCountQuery as any);

      const mockGamesQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.select).mockReturnValueOnce(mockGamesQuery as any);

      const request = new NextRequest('http://localhost:3000/api/players?limit=10');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.limit).toBe(10);
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
    });

    it('should handle offset correctly', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([]),
      };

      const mockCountQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 50 }]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);
      vi.mocked(db.select).mockReturnValueOnce(mockCountQuery as any);

      const mockGamesQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.select).mockReturnValueOnce(mockGamesQuery as any);

      const request = new NextRequest('http://localhost:3000/api/players?offset=20');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.offset).toBe(20);
      expect(mockQuery.offset).toHaveBeenCalledWith(20);
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors', async () => {
      const { db } = await import('@/lib/db');
      
      vi.mocked(db.select).mockImplementation(() => {
        throw new Error('Database connection error');
      });

      const request = new NextRequest('http://localhost:3000/api/players');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch players');
    });
  });
});
