import { pgTable, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const positionEnum = pgEnum('position', ['C', 'LW', 'RW', 'D', 'G']);
export const gameStatusEnum = pgEnum('game_status', ['scheduled', 'in_progress', 'final']);

// NHL Teams
export const teams = pgTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  abbreviation: text('abbreviation').notNull().unique(),
  conference: text('conference'), // 'Eastern' or 'Western'
  division: text('division'), // 'Atlantic', 'Metropolitan', 'Central', 'Pacific'
  createdAt: timestamp('created_at').defaultNow(),
});

// NHL Players
export const players = pgTable('players', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  position: positionEnum('position').notNull(),
  teamId: text('team_id').references(() => teams.id),
  jerseyNumber: integer('jersey_number'),
  dateOfBirth: timestamp('date_of_birth'), // For calculating age
  // Current season stats (will be updated via ETL)
  // Skater stats
  goals: integer('goals').default(0),
  assists: integer('assists').default(0),
  points: integer('points').default(0),
  plusMinus: integer('plus_minus').default(0),
  penaltyMinutes: integer('penalty_minutes').default(0), // PIM
  shotsOnGoal: integer('shots_on_goal').default(0), // SOG
  powerPlayPoints: integer('power_play_points').default(0), // PPP
  shortHandedPoints: integer('short_handed_points').default(0), // SHP
  hits: integer('hits').default(0), // Hit
  blocks: integer('blocks').default(0), // Blk
  takeaways: integer('takeaways').default(0), // Tk
  // Goalie stats
  wins: integer('wins').default(0),
  overtimeWins: integer('overtime_wins').default(0), // OW
  overtimeLosses: integer('overtime_losses').default(0), // OL
  shootoutLosses: integer('shootout_losses').default(0), // SHL
  goalsAgainst: integer('goals_against').default(0), // GA
  saves: integer('saves').default(0), // SV
  shutouts: integer('shutouts').default(0), // SHO
  shootoutWins: integer('shootout_wins').default(0), // ShW
  goalieGoals: integer('goalie_goals').default(0), // G (for goalies)
  goalieAssists: integer('goalie_assists').default(0), // A (for goalies)
  losses: integer('losses').default(0),
  savePercentage: integer('save_percentage'), // Stored as integer (e.g., 925 for .925)
  // Rankings
  positionRank: integer('position_rank'), // Pos Rank
  positionRankLast10: integer('position_rank_last_10'), // Pos Rank Last 10
  // Heat & Trend
  heatScore: integer('heat_score').default(0), // -3 to 3 (negative = ice, positive = fire)
  trendScore: integer('trend_score').default(0), // Trend score (how much more frequently added)
  // Status
  status: text('status').default('healthy'), // 'healthy', 'questionable', 'injured', 'out'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// NHL Games/Schedule
export const games = pgTable('games', {
  id: text('id').primaryKey(),
  homeTeamId: text('home_team_id').references(() => teams.id).notNull(),
  awayTeamId: text('away_team_id').references(() => teams.id).notNull(),
  gameDate: timestamp('game_date').notNull(),
  status: gameStatusEnum('status').default('scheduled'),
  homeScore: integer('home_score'),
  awayScore: integer('away_score'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Users (for future auth/leagues)
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
}));

export const gamesRelations = relations(games, ({ one }) => ({
  homeTeam: one(teams, {
    fields: [games.homeTeamId],
    references: [teams.id],
  }),
  awayTeam: one(teams, {
    fields: [games.awayTeamId],
    references: [teams.id],
  }),
}));

// Export types
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

