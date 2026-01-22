import type { Team } from '@/lib/db/schema';

// Re-export for convenience
export type { Team };

export const mockTeam: Team = {
  id: 'team-1',
  name: 'Edmonton Oilers',
  abbreviation: 'EDM',
  conference: 'Western',
  division: 'Pacific',
  createdAt: new Date(),
};

export const mockTeams: Team[] = [
  mockTeam,
  {
    id: 'team-2',
    name: 'Winnipeg Jets',
    abbreviation: 'WPG',
    conference: 'Western',
    division: 'Central',
    createdAt: new Date(),
  },
  {
    id: 'team-3',
    name: 'Toronto Maple Leafs',
    abbreviation: 'TOR',
    conference: 'Eastern',
    division: 'Atlantic',
    createdAt: new Date(),
  },
];
