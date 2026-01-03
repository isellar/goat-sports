import { pgTable, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const positionEnum = pgEnum('position', ['QB', 'RB', 'WR', 'TE', 'K', 'DEF', 'C', 'LW', 'RW', 'D', 'G']);
export const gameStatusEnum = pgEnum('game_status', ['scheduled', 'in_progress', 'final']);

// Tables - Add your schema definitions here
// This is a placeholder structure. Update with your actual database schema.

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const teams = pgTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  abbreviation: text('abbreviation').notNull(),
  conference: text('conference'),
  division: text('division'),
});

export const players = pgTable('players', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  position: positionEnum('position').notNull(),
  teamId: text('team_id').references(() => teams.id),
  jerseyNumber: integer('jersey_number'),
});

// Relations
export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;

