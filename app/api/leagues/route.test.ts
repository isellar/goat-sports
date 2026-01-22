import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST } from './route';
import { NextRequest } from 'next/server';
import { mockLeague, mockUser } from '../../../__tests__/mocks/leagues';

// Mock the database module
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
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

describe('/api/leagues', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET - List Leagues', () => {
    it('should return user\'s leagues when userId provided', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([
          { league: mockLeague, membership: { joinedAt: new Date() } },
        ]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);

      const request = new NextRequest('http://localhost:3000/api/leagues?userId=user-1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.leagues).toBeDefined();
      expect(Array.isArray(data.leagues)).toBe(true);
    });

    it('should return all public leagues when no userId', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockResolvedValue([mockLeague]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);

      const request = new NextRequest('http://localhost:3000/api/leagues');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.leagues).toBeDefined();
      expect(Array.isArray(data.leagues)).toBe(true);
    });

    it('should include league metadata', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockResolvedValue([mockLeague]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);

      const request = new NextRequest('http://localhost:3000/api/leagues');
      const response = await GET(request);
      const data = await response.json();

      expect(data.leagues[0]).toHaveProperty('id');
      expect(data.leagues[0]).toHaveProperty('name');
      expect(data.leagues[0]).toHaveProperty('status');
    });
  });

  describe('POST - Create League', () => {
    it('should create league with valid data', async () => {
      const { db } = await import('@/lib/db');
      
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([mockLeague]),
      };

      vi.mocked(db.insert).mockReturnValueOnce(mockInsert as any);
      vi.mocked(db.insert).mockReturnValueOnce({
        values: vi.fn().mockResolvedValue(undefined),
      } as any);
      vi.mocked(db.insert).mockReturnValueOnce({
        values: vi.fn().mockResolvedValue(undefined),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/leagues', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test League',
          commissionerId: 'user-1',
          maxTeams: 12,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.league).toBeDefined();
      expect(data.league.name).toBe('Test League');
    });

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/leagues', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test League',
          // Missing commissionerId
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('required');
    });

    it('should set commissioner correctly', async () => {
      const { db } = await import('@/lib/db');
      
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([mockLeague]),
      };

      vi.mocked(db.insert).mockReturnValueOnce(mockInsert as any);
      vi.mocked(db.insert).mockReturnValueOnce({
        values: vi.fn().mockResolvedValue(undefined),
      } as any);
      vi.mocked(db.insert).mockReturnValueOnce({
        values: vi.fn().mockResolvedValue(undefined),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/leagues', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test League',
          commissionerId: 'user-1',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(mockInsert.values).toHaveBeenCalled();
    });

    it('should set default values', async () => {
      const { db } = await import('@/lib/db');
      
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([mockLeague]),
      };

      vi.mocked(db.insert).mockReturnValueOnce(mockInsert as any);
      vi.mocked(db.insert).mockReturnValueOnce({
        values: vi.fn().mockResolvedValue(undefined),
      } as any);
      vi.mocked(db.insert).mockReturnValueOnce({
        values: vi.fn().mockResolvedValue(undefined),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/leagues', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test League',
          commissionerId: 'user-1',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      // Verify default values are set
      const callArgs = mockInsert.values.mock.calls[0][0];
      expect(callArgs.maxTeams).toBe(12);
      expect(callArgs.draftType).toBe('snake');
      expect(callArgs.rosterSize).toBe(20);
    });

    it('should handle database not configured', async () => {
      vi.doMock('@/lib/db', () => ({
        db: null,
      }));

      const request = new NextRequest('http://localhost:3000/api/leagues', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test League',
          commissionerId: 'user-1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe('Database not configured');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors', async () => {
      const { db } = await import('@/lib/db');
      
      vi.mocked(db.select).mockImplementation(() => {
        throw new Error('Database connection error');
      });

      const request = new NextRequest('http://localhost:3000/api/leagues');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch leagues');
    });
  });
});
