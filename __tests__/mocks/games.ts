import type { Game } from '@/lib/db/schema';

// Re-export for convenience
export type { Game };

export const mockGame: Game = {
  id: 'game-1',
  homeTeamId: 'team-1',
  awayTeamId: 'team-2',
  gameDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  status: 'scheduled',
  homeScore: null,
  awayScore: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockGameToday: Game = {
  ...mockGame,
  id: 'game-2',
  gameDate: new Date(), // Today
};

export const mockGamePast: Game = {
  ...mockGame,
  id: 'game-3',
  gameDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
};
