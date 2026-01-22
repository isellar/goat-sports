import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST } from './route';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { mockLeague, mockFantasyTeam } from '@/__tests__/mocks/leagues';

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
  },
}));

// Mock drizzle-orm
vi.mock('drizzle-orm', async (importOriginal) => {
  const actual = await importOriginal<typeof import('drizzle-orm')>();
  return {
    ...actual,
    eq: vi.fn((a, b) => ({ type: 'eq', left: a, right: b })),
  };
});

// Mock draft utilities
vi.mock('@/lib/utils/draft', () => ({
  generateSnakeDraftOrder: vi.fn((teams, rounds) => {
    const teamIds = teams.map((t: any) => t.id);
    return [...teamIds, ...teamIds.reverse()]; // Simple 2-round example
  }),
  shuffleDraftOrder: vi.fn((teams) => teams),
}));

describe('/api/leagues/[id]/draft', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return draft if exists', async () => {
      const mockDraft = {
        id: 'draft_1',
        leagueId: 'league_1',
        status: 'scheduled',
        draftOrder: JSON.stringify(['team_1', 'team_2']),
        currentPick: 1,
        currentTeamId: 'team_1',
        pickTimeLimit: 60,
        startedAt: null,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      let callCount = 0;
      vi.mocked(db.select).mockImplementation(() => {
        callCount++;
        return {
          from: vi.fn().mockReturnThis(),
          where: vi.fn().mockResolvedValueOnce(callCount === 1 ? [mockDraft] : []),
        } as any;
      });

      const request = new NextRequest('http://localhost:3000/api/leagues/league_1/draft');
      const params = Promise.resolve({ id: 'league_1' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('draft');
    });

    it('should return 404 if draft not found', async () => {
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([]),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/leagues/league_1/draft');
      const params = Promise.resolve({ id: 'league_1' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Draft not found');
    });
  });

  describe('POST', () => {
    it('should create draft for league', async () => {
      // Mock league exists
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([mockLeague]),
      } as any);

      // Mock no existing draft
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([]),
      } as any);

      // Mock teams
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([mockFantasyTeam, { ...mockFantasyTeam, id: 'team_2' }]),
      } as any);

      // Mock insert
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValueOnce([
          {
            id: 'draft_new',
            leagueId: 'league_1',
            status: 'scheduled',
            draftOrder: JSON.stringify(['team_1', 'team_2']),
            currentPick: 1,
            currentTeamId: 'team_1',
            pickTimeLimit: 60,
            startedAt: null,
            completedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      };
      vi.mocked(db.insert).mockReturnValueOnce(mockInsert as any);

      const request = new NextRequest('http://localhost:3000/api/leagues/league_1/draft', {
        method: 'POST',
        body: JSON.stringify({ pickTimeLimit: 60 }),
      });
      const params = Promise.resolve({ id: 'league_1' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('draft');
      expect(data.draft.status).toBe('scheduled');
    });

    it('should return 400 if league has less than 2 teams', async () => {
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([mockLeague]),
      } as any);

      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([]),
      } as any);

      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([mockFantasyTeam]), // Only 1 team
      } as any);

      const request = new NextRequest('http://localhost:3000/api/leagues/league_1/draft', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const params = Promise.resolve({ id: 'league_1' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('League must have at least 2 teams to start a draft');
    });

    it('should return 400 if draft already exists', async () => {
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([mockLeague]),
      } as any);

      // Mock existing draft
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([
          {
            id: 'draft_existing',
            leagueId: 'league_1',
            status: 'scheduled',
          },
        ]),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/leagues/league_1/draft', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const params = Promise.resolve({ id: 'league_1' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Draft already exists for this league');
    });
  });
});
