import type { Draft, DraftPick, FantasyTeam, Player } from '@/lib/db/schema';
import { mockFantasyTeam } from './fantasy-teams';

export const mockDraft: Draft = {
  id: 'draft_1',
  leagueId: 'league_1',
  status: 'scheduled',
  draftOrder: JSON.stringify(['team_1', 'team_2', 'team_3']),
  currentPick: 1,
  currentTeamId: 'team_1',
  pickTimeLimit: 60,
  startedAt: null,
  completedAt: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockDraftInProgress: Draft = {
  ...mockDraft,
  id: 'draft_2',
  status: 'in_progress',
  currentPick: 5,
  currentTeamId: 'team_2',
  startedAt: new Date('2024-01-01'),
};

export const mockDraftPick: DraftPick = {
  id: 'pick_1',
  draftId: 'draft_1',
  pickNumber: 1,
  teamId: 'team_1',
  playerId: 'player_1',
  bidAmount: null,
  pickedAt: new Date('2024-01-01'),
  createdAt: new Date('2024-01-01'),
};
