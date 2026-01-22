import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import { mockLeague } from '../../../../../__tests__/mocks/leagues';

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
    count: vi.fn(() => ({ type: 'count' })),
  };
});

describe('/api/leagues/[id]/join', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST - Join League', () => {
    it('should join existing league', async () => {
      const { db } = await import('@/lib/db');
      
      // Mock league exists
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([mockLeague]),
      } as any);

      // Mock no existing membership
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      } as any);

      // Mock member count
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 5 }]),
      } as any);

      // Mock insert operations
      vi.mocked(db.insert).mockReturnValueOnce({
        values: vi.fn().mockResolvedValue(undefined),
      } as any);
      vi.mocked(db.insert).mockReturnValueOnce({
        values: vi.fn().mockResolvedValue(undefined),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/leagues/league-1/join', {
        method: 'POST',
        body: JSON.stringify({ userId: 'user-2' }),
      });

      const response = await POST(request, { params: Promise.resolve({ id: 'league-1' }) });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe('Successfully joined league');
      expect(data.teamId).toBeDefined();
    });

    it('should check league capacity', async () => {
      const { db } = await import('@/lib/db');
      
      const fullLeague = { ...mockLeague, maxTeams: 12 };
      
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([fullLeague]),
      } as any);

      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      } as any);

      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 12 }]),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/leagues/league-1/join', {
        method: 'POST',
        body: JSON.stringify({ userId: 'user-2' }),
      });

      const response = await POST(request, { params: Promise.resolve({ id: 'league-1' }) });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('League is full');
    });

    it('should handle duplicate joins', async () => {
      const { db } = await import('@/lib/db');
      
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([mockLeague]),
      } as any);

      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ id: 'existing-membership' }]),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/leagues/league-1/join', {
        method: 'POST',
        body: JSON.stringify({ userId: 'user-1' }),
      });

      const response = await POST(request, { params: Promise.resolve({ id: 'league-1' }) });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('already a member');
    });

    it('should validate userId is required', async () => {
      const request = new NextRequest('http://localhost:3000/api/leagues/league-1/join', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request, { params: Promise.resolve({ id: 'league-1' }) });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('userId is required');
    });

    it('should handle non-existent league', async () => {
      const { db } = await import('@/lib/db');
      
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/leagues/nonexistent/join', {
        method: 'POST',
        body: JSON.stringify({ userId: 'user-2' }),
      });

      const response = await POST(request, { params: Promise.resolve({ id: 'nonexistent' }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('League not found');
    });
  });
});
