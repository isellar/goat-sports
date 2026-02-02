import { pgTable, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const positionEnum = pgEnum('position', ['C', 'LW', 'RW', 'D', 'G']);
export const gameStatusEnum = pgEnum('game_status', ['scheduled', 'in_progress', 'final']);
export const draftTypeEnum = pgEnum('draft_type', ['snake', 'auction']);
export const leagueStatusEnum = pgEnum('league_status', ['draft', 'active', 'completed']);
export const draftStatusEnum = pgEnum('draft_status', ['scheduled', 'in_progress', 'completed', 'cancelled']);

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

// Profiles (links to Supabase auth.users)
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').unique().notNull(), // Links to Supabase auth.users.id
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Fantasy Leagues
export const leagues = pgTable('leagues', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  commissionerId: text('commissioner_id').references(() => users.id).notNull(),
  status: leagueStatusEnum('status').default('draft'),
  maxTeams: integer('max_teams').default(12),
  draftType: draftTypeEnum('draft_type').default('snake'),
  // Scoring settings (stored as JSON or individual fields)
  // For now, we'll use a simple points-per-stat system
  scoringSettings: text('scoring_settings'), // JSON string
  // Roster settings
  rosterSize: integer('roster_size').default(20),
  // Draft settings
  draftDate: timestamp('draft_date'),
  draftOrder: text('draft_order'), // JSON array of team IDs
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Fantasy Teams (user teams within a league)
export const fantasyTeams = pgTable('fantasy_teams', {
  id: text('id').primaryKey(),
  leagueId: text('league_id').references(() => leagues.id).notNull(),
  ownerId: text('owner_id').references(() => users.id), // Nullable - team may not have owner yet
  name: text('name').notNull(),
  abbreviation: text('abbreviation'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Rosters (players on fantasy teams)
export const rosters = pgTable('rosters', {
  id: text('id').primaryKey(),
  fantasyTeamId: text('fantasy_team_id').references(() => fantasyTeams.id).notNull(),
  playerId: text('player_id').references(() => players.id).notNull(),
  // Lineup position (bench, active, etc.)
  lineupPosition: text('lineup_position'), // 'C', 'LW', 'RW', 'D', 'G', 'BN' (bench), 'IR'
  addedAt: timestamp('added_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// League Memberships (many-to-many: users <-> leagues)
export const leagueMemberships = pgTable('league_memberships', {
  id: text('id').primaryKey(),
  leagueId: text('league_id').references(() => leagues.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  joinedAt: timestamp('joined_at').defaultNow(),
});

// Drafts (one per league)
export const drafts = pgTable('drafts', {
  id: text('id').primaryKey(),
  leagueId: text('league_id').references(() => leagues.id).notNull().unique(),
  status: draftStatusEnum('status').default('scheduled'),
  draftOrder: text('draft_order'), // JSON array of team IDs
  currentPick: integer('current_pick').default(1), // Current pick number
  currentTeamId: text('current_team_id').references(() => fantasyTeams.id), // Team whose turn it is
  pickTimeLimit: integer('pick_time_limit'), // Time limit per pick in seconds (null = no limit)
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Draft Picks (individual player selections)
export const draftPicks = pgTable('draft_picks', {
  id: text('id').primaryKey(),
  draftId: text('draft_id').references(() => drafts.id).notNull(),
  pickNumber: integer('pick_number').notNull(), // Overall pick number (1, 2, 3, etc.)
  teamId: text('team_id').references(() => fantasyTeams.id).notNull(),
  playerId: text('player_id').references(() => players.id).notNull(),
  // For auction drafts
  bidAmount: integer('bid_amount'), // Bid amount (null for snake drafts)
  pickedAt: timestamp('picked_at').defaultNow(),
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

export const leaguesRelations = relations(leagues, ({ one, many }) => ({
  commissioner: one(users, {
    fields: [leagues.commissionerId],
    references: [users.id],
  }),
  fantasyTeams: many(fantasyTeams),
  memberships: many(leagueMemberships),
}));

export const fantasyTeamsRelations = relations(fantasyTeams, ({ one, many }) => ({
  league: one(leagues, {
    fields: [fantasyTeams.leagueId],
    references: [leagues.id],
  }),
  owner: one(users, {
    fields: [fantasyTeams.ownerId],
    references: [users.id],
  }),
  rosters: many(rosters),
}));

export const rostersRelations = relations(rosters, ({ one }) => ({
  fantasyTeam: one(fantasyTeams, {
    fields: [rosters.fantasyTeamId],
    references: [fantasyTeams.id],
  }),
  player: one(players, {
    fields: [rosters.playerId],
    references: [players.id],
  }),
}));

export const leagueMembershipsRelations = relations(leagueMemberships, ({ one }) => ({
  league: one(leagues, {
    fields: [leagueMemberships.leagueId],
    references: [leagues.id],
  }),
  user: one(users, {
    fields: [leagueMemberships.userId],
    references: [users.id],
  }),
}));

export const draftsRelations = relations(drafts, ({ one, many }) => ({
  league: one(leagues, {
    fields: [drafts.leagueId],
    references: [leagues.id],
  }),
  currentTeam: one(fantasyTeams, {
    fields: [drafts.currentTeamId],
    references: [fantasyTeams.id],
  }),
  picks: many(draftPicks),
}));

export const draftPicksRelations = relations(draftPicks, ({ one }) => ({
  draft: one(drafts, {
    fields: [draftPicks.draftId],
    references: [drafts.id],
  }),
  team: one(fantasyTeams, {
    fields: [draftPicks.teamId],
    references: [fantasyTeams.id],
  }),
  player: one(players, {
    fields: [draftPicks.playerId],
    references: [players.id],
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
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type League = typeof leagues.$inferSelect;
export type NewLeague = typeof leagues.$inferInsert;
export type FantasyTeam = typeof fantasyTeams.$inferSelect;
export type NewFantasyTeam = typeof fantasyTeams.$inferInsert;
export type Roster = typeof rosters.$inferSelect;
export type NewRoster = typeof rosters.$inferInsert;
export type LeagueMembership = typeof leagueMemberships.$inferSelect;
export type NewLeagueMembership = typeof leagueMemberships.$inferInsert;
export type Draft = typeof drafts.$inferSelect;
export type NewDraft = typeof drafts.$inferInsert;
export type DraftPick = typeof draftPicks.$inferSelect;
export type NewDraftPick = typeof draftPicks.$inferInsert;

