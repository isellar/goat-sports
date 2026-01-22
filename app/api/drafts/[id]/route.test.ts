import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, PATCH } from './route';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { mockDraft, mockDraftInProgress } from '@/__tests__/mocks/drafts';
import { mockFantasyTeam } from '@/__tests__/mocks/fantasy-teams';
import { mockSkater as mockPlayer } from '@/__tests__/mocks/players';
import { mockTeam } from '@/__tests__/mocks/teams';

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
}));

// Mock drizzle-orm
vi.mock('drizzle-orm', async (importOriginal) => {
  const actual = await importOriginal<typeof import('drizzle-orm')>();
  return {
    ...actual,
    eq: vi.fn((a, b) => ({ type: 'eq', left: a, right: b })),
    and: vi.fn((...args) => ({ type: 'and', conditions: args })),
    asc: vi.fn((a) => ({ type: 'asc', column: a })),
  };
});

describe('/api/drafts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return draft with picks and current team', async () => {
      // Mock draft
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([mockDraft]),
      } as any);

      // Mock picks
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValueOnce([]),
      } as any);

      // Mock current team
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([mockFantasyTeam]),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/drafts/draft_1');
      const params = Promise.resolve({ id: 'draft_1' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('draft');
      expect(data).toHaveProperty('picks');
    });

    it('should return 404 if draft not found', async () => {
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([]),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/drafts/invalid');
      const params = Promise.resolve({ id: 'invalid' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Draft not found');
    });
  });

  describe('PATCH', () => {
    it('should update draft status', async () => {
      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValueOnce([
          {
            ...mockDraft,
            status: 'in_progress',
            startedAt: new Date(),
          },
        ]),
      };
      vi.mocked(db.update).mockReturnValueOnce(mockUpdate as any);

      const request = new NextRequest('http://localhost:3000/api/drafts/draft_1', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'in_progress' }),
      });
      const params = Promise.resolve({ id: 'draft_1' });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.draft.status).toBe('in_progress');
      expect(mockUpdate.set).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'in_progress',
          startedAt: expect.any(Date),
        })
      );
    });

    it('should update current pick and team', async () => {
      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValueOnce([
          {
            ...mockDraft,
            currentPick: 2,
            currentTeamId: 'team_2',
          },
        ]),
      };
      vi.mocked(db.update).mockReturnValueOnce(mockUpdate as any);

      const request = new NextRequest('http://localhost:3000/api/drafts/draft_1', {
        method: 'PATCH',
        body: JSON.stringify({
          currentPick: 2,
          currentTeamId: 'team_2',
        }),
      });
      const params = Promise.resolve({ id: 'draft_1' });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.draft.currentPick).toBe(2);
      expect(data.draft.currentTeamId).toBe('team_2');
    });

    it('should set completedAt when status is completed', async () => {
      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValueOnce([
          {
            ...mockDraft,
            status: 'completed',
            completedAt: new Date(),
          },
        ]),
      };
      vi.mocked(db.update).mockReturnValueOnce(mockUpdate as any);

      const request = new NextRequest('http://localhost:3000/api/drafts/draft_1', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'completed' }),
      });
      const params = Promise.resolve({ id: 'draft_1' });

      await PATCH(request, { params });

      expect(mockUpdate.set).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'completed',
          completedAt: expect.any(Date),
        })
      );
    });
  });
});
