import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { mockDraftInProgress } from '@/__tests__/mocks/drafts';
import { mockFantasyTeam } from '@/__tests__/mocks/fantasy-teams';
import { mockSkater as mockPlayer } from '@/__tests__/mocks/players';
import { mockLeague } from '@/__tests__/mocks/leagues';

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
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
  };
});

// Mock draft utilities
vi.mock('@/lib/utils/draft', () => ({
  getTeamForPick: vi.fn((order, pick) => {
    if (pick < 1 || pick > order.length) return null;
    return order[pick - 1];
  }),
  calculateTotalPicks: vi.fn((teams, rosterSize) => teams * rosterSize),
}));

describe('/api/drafts/[id]/pick', () => {
  let getTeamForPick: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const draftUtils = await import('@/lib/utils/draft');
    getTeamForPick = draftUtils.getTeamForPick as ReturnType<typeof vi.fn>;
  });

  describe('POST', () => {
    it('should make a draft pick and advance to next pick', async () => {
      const draftWithOrder = {
        ...mockDraftInProgress,
        draftOrder: JSON.stringify(['team_2', 'team_3', 'team_1']),
        currentPick: 1,
        currentTeamId: 'team_2',
      };

      const { getTeamForPick } = await import('@/lib/utils/draft');
      vi.mocked(getTeamForPick).mockReturnValue('team_2'); // First pick should be team_2

      let callCount = 0;
      vi.mocked(db.select).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // Get draft
          return {
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValueOnce([draftWithOrder]),
          } as any;
        } else if (callCount === 2) {
          // Check existing pick
          return {
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValueOnce([]),
          } as any;
        } else {
          // Get league
          return {
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValueOnce([mockLeague]),
          } as any;
        }
      });

      // Mock insert for draft pick
      const mockPickInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValueOnce([
          {
            id: 'pick_new',
            draftId: 'draft_2',
            pickNumber: 5,
            teamId: 'team_2',
            playerId: 'player_1',
            bidAmount: null,
            pickedAt: new Date(),
            createdAt: new Date(),
          },
        ]),
      };
      vi.mocked(db.insert).mockReturnValueOnce(mockPickInsert as any);

      // Mock insert for roster
      const mockRosterInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValueOnce([{}]),
      };
      vi.mocked(db.insert).mockReturnValueOnce(mockRosterInsert as any);

      // Mock update draft - next pick should be team_3
      vi.mocked(getTeamForPick).mockReturnValueOnce('team_2'); // Current pick
      vi.mocked(getTeamForPick).mockReturnValueOnce('team_3'); // Next pick

      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValueOnce([
          {
            ...draftWithOrder,
            currentPick: 2,
            currentTeamId: 'team_3',
          },
        ]),
      };
      vi.mocked(db.update).mockReturnValueOnce(mockUpdate as any);

      // Mock get pick with player
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([
          {
            pick: {
              id: 'pick_new',
              draftId: 'draft_2',
              pickNumber: 5,
              teamId: 'team_2',
              playerId: 'player_1',
            },
            player: mockPlayer,
          },
        ]),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/drafts/draft_2/pick', {
        method: 'POST',
        body: JSON.stringify({ playerId: 'player_1' }),
      });
      const params = Promise.resolve({ id: 'draft_2' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('pick');
      expect(data).toHaveProperty('draft');
      expect(data.draft.currentPick).toBe(2);
    });

    it('should return 400 if playerId missing', async () => {
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([mockDraftInProgress]),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/drafts/draft_2/pick', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const params = Promise.resolve({ id: 'draft_2' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('playerId is required');
    });

    it('should return 400 if draft not in progress', async () => {
      const scheduledDraft = {
        ...mockDraftInProgress,
        status: 'scheduled',
      };

      let callCount = 0;
      vi.mocked(db.select).mockImplementation(() => {
        callCount++;
        return {
          from: vi.fn().mockReturnThis(),
          where: vi.fn().mockResolvedValueOnce(callCount === 1 ? [scheduledDraft] : []),
        } as any;
      });

      const request = new NextRequest('http://localhost:3000/api/drafts/draft_2/pick', {
        method: 'POST',
        body: JSON.stringify({ playerId: 'player_1' }),
      });
      const params = Promise.resolve({ id: 'draft_2' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Draft is not in progress');
    });

    it('should return 400 if player already drafted', async () => {
      const draftWithOrder = {
        ...mockDraftInProgress,
        draftOrder: JSON.stringify(['team_2', 'team_3']),
        currentPick: 1,
        currentTeamId: 'team_2',
      };

      mockGetTeamForPick.mockReturnValue('team_2');

      let callCount = 0;
      vi.mocked(db.select).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValueOnce([draftWithOrder]),
          } as any;
        } else {
          // Mock existing pick
          return {
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValueOnce([
              {
                id: 'pick_existing',
                playerId: 'player_1',
              },
            ]),
          } as any;
        }
      });

      const request = new NextRequest('http://localhost:3000/api/drafts/draft_2/pick', {
        method: 'POST',
        body: JSON.stringify({ playerId: 'player_1' }),
      });
      const params = Promise.resolve({ id: 'draft_2' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Player has already been drafted');
    });

    it('should add player to roster when picked', async () => {
      const draftWithOrder = {
        ...mockDraftInProgress,
        draftOrder: JSON.stringify(['team_2', 'team_3']),
        currentPick: 1,
        currentTeamId: 'team_2',
      };

      mockGetTeamForPick.mockReturnValue('team_2');

      let callCount = 0;
      vi.mocked(db.select).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValueOnce([draftWithOrder]),
          } as any;
        } else if (callCount === 2) {
          return {
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValueOnce([]),
          } as any;
        } else {
          return {
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValueOnce([mockLeague]),
          } as any;
        }
      });

      const mockPickInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValueOnce([{}]),
      };
      vi.mocked(db.insert).mockReturnValueOnce(mockPickInsert as any);

      const mockRosterInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValueOnce([{}]),
      };
      vi.mocked(db.insert).mockReturnValueOnce(mockRosterInsert as any);

      vi.mocked(getTeamForPick).mockReturnValueOnce('team_2'); // Current
      vi.mocked(getTeamForPick).mockReturnValueOnce('team_3'); // Next

      vi.mocked(db.update).mockReturnValueOnce({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValueOnce([draftWithOrder]),
      } as any);

      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([{ pick: {}, player: mockPlayer }]),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/drafts/draft_2/pick', {
        method: 'POST',
        body: JSON.stringify({ playerId: 'player_1' }),
      });
      const params = Promise.resolve({ id: 'draft_2' });

      await POST(request, { params });

      // Verify roster insert was called
      expect(mockRosterInsert.values).toHaveBeenCalledWith(
        expect.objectContaining({
          fantasyTeamId: mockDraftInProgress.currentTeamId,
          playerId: 'player_1',
          lineupPosition: 'BN',
        })
      );
    });
  });
});
