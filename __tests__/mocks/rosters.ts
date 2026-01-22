import type { Roster, Player, Team } from '@/lib/db/schema';
import { mockSkater as mockPlayer } from './players';
import { mockTeam } from './teams';

export const mockRoster: Roster = {
  id: 'roster_1',
  fantasyTeamId: 'team_1',
  playerId: 'player_1',
  lineupPosition: 'BN',
  addedAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockRosterWithPlayer: Roster & { player: Player & { team: Team | null } } = {
  ...mockRoster,
  player: {
    ...mockPlayer,
    team: mockTeam,
  },
};

export const mockRosterActive: Roster = {
  ...mockRoster,
  id: 'roster_2',
  lineupPosition: 'C',
};

export const mockRosterGoalie: Roster = {
  ...mockRoster,
  id: 'roster_3',
  playerId: 'player_12', // Goalie player
  lineupPosition: 'G',
};
