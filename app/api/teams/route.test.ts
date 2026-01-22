import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';
import { mockTeams } from '../../../__tests__/mocks/teams';

// Mock the database module
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
  },
}));

describe('/api/teams', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET - Basic Functionality', () => {
    it('should return all teams', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockTeams),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);

      const request = new NextRequest('http://localhost:3000/api/teams');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.teams).toBeDefined();
      expect(Array.isArray(data.teams)).toBe(true);
      expect(data.teams.length).toBeGreaterThan(0);
    });

    it('should return correct data structure', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockTeams),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);

      const request = new NextRequest('http://localhost:3000/api/teams');
      const response = await GET(request);
      const data = await response.json();

      expect(data).toHaveProperty('teams');
      expect(data.teams[0]).toHaveProperty('id');
      expect(data.teams[0]).toHaveProperty('name');
      expect(data.teams[0]).toHaveProperty('abbreviation');
    });

    it('should include all required fields', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([mockTeams[0]]),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);

      const request = new NextRequest('http://localhost:3000/api/teams');
      const response = await GET(request);
      const data = await response.json();

      const team = data.teams[0];
      expect(team).toHaveProperty('id');
      expect(team).toHaveProperty('name');
      expect(team).toHaveProperty('abbreviation');
      expect(team).toHaveProperty('conference');
      expect(team).toHaveProperty('division');
    });

    it('should handle database not configured', async () => {
      // This test requires the actual route to check for null db
      // Since we're mocking db, we'll test the error path differently
      const { db } = await import('@/lib/db');
      vi.mocked(db).select = null as any;

      const request = new NextRequest('http://localhost:3000/api/teams');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe('Database not configured');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors', async () => {
      const { db } = await import('@/lib/db');
      
      const mockQuery = {
        from: vi.fn().mockImplementation(() => {
          throw new Error('Database connection error');
        }),
      };

      vi.mocked(db.select).mockReturnValueOnce(mockQuery as any);

      const request = new NextRequest('http://localhost:3000/api/teams');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch teams');
    });
  });
});
