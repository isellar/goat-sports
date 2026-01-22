import type { FantasyTeam, User, League } from '@/lib/db/schema';

export const mockFantasyTeam: FantasyTeam = {
  id: 'team_1',
  leagueId: 'league_1',
  ownerId: 'user_1',
  name: 'Test Team',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockFantasyTeamWithDetails = {
  ...mockFantasyTeam,
  owner: {
    id: 'user_1',
    email: 'owner@test.com',
    name: 'Test Owner',
    createdAt: new Date('2024-01-01'),
  } as User,
  league: {
    id: 'league_1',
    name: 'Test League',
    commissionerId: 'user_1',
    status: 'draft',
    maxTeams: 12,
    draftType: 'snake',
    rosterSize: 20,
    scoringSettings: null,
    draftDate: null,
    draftOrder: null,
    description: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  } as League,
};
