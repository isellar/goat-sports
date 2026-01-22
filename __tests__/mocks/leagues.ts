import type { League, LeagueMembership, FantasyTeam, User } from '@/lib/db/schema';

export const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  createdAt: new Date(),
};

export const mockLeague: League = {
  id: 'league-1',
  name: 'Test League',
  description: 'A test league',
  commissionerId: 'user-1',
  status: 'draft',
  maxTeams: 12,
  draftType: 'snake',
  rosterSize: 20,
  scoringSettings: null,
  draftDate: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockLeagueMembership: LeagueMembership = {
  id: 'membership-1',
  leagueId: 'league-1',
  userId: 'user-1',
  joinedAt: new Date(),
};

export const mockFantasyTeam: FantasyTeam = {
  id: 'fantasy-team-1',
  leagueId: 'league-1',
  ownerId: 'user-1',
  name: 'Test Team',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Fix missing draftOrder field
export const mockLeagueWithDraftOrder: League = {
  ...mockLeague,
  draftOrder: null,
};