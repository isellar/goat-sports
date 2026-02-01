/**
 * Fantasy Team Database Loader
 * Handles upserting fantasy team data into the database
 */

import { db } from '@/lib/db';
import { fantasyTeams, leagues, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { FantraxTeam } from '../types/fantrax';

export interface FantasyTeamLoadResult {
  inserted: number;
  updated: number;
  failed: number;
  errors: Array<{ team: string; error: string }>;
}

/**
 * Load fantasy teams from Fantrax into the database
 * Requires a league ID to associate teams with
 */
export async function loadFantasyTeams(
  fantraxTeams: Array<FantraxTeam & { owner?: string }>,
  leagueId: string
): Promise<FantasyTeamLoadResult> {
  if (!db) {
    throw new Error('Database not configured');
  }

  const result: FantasyTeamLoadResult = {
    inserted: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  // Verify league exists
  const [league] = await db
    .select()
    .from(leagues)
    .where(eq(leagues.id, leagueId))
    .limit(1);

  if (!league) {
    throw new Error(`League ${leagueId} not found in database`);
  }

  // Process each team
  for (const fantraxTeam of fantraxTeams) {
    try {
      const teamId = `fantrax_${fantraxTeam.team_id}`;

      // If owner is provided, ensure user exists
      let ownerId: string | null = null;
      if (fantraxTeam.owner) {
        // For now, create a placeholder user with the owner name
        // In production, you'd want to map Fantrax usernames to actual users
        const userId = `fantrax_user_${fantraxTeam.owner.toLowerCase().replace(/\s+/g, '_')}`;

        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (!existingUser) {
          await db.insert(users).values({
            id: userId,
            email: `${userId}@fantrax.placeholder`, // Placeholder email
            name: fantraxTeam.owner,
          });
        }

        ownerId = userId;
      }

      // Check if team exists
      const [existingTeam] = await db
        .select()
        .from(fantasyTeams)
        .where(eq(fantasyTeams.id, teamId))
        .limit(1);

      const teamData = {
        name: fantraxTeam.name,
        abbreviation: fantraxTeam.abbreviation || fantraxTeam.name.substring(0, 3).toUpperCase(),
        leagueId,
        ownerId,
      };

      if (existingTeam) {
        // Update existing team
        await db
          .update(fantasyTeams)
          .set({
            ...teamData,
            updatedAt: new Date(),
          })
          .where(eq(fantasyTeams.id, teamId));
        result.updated++;
      } else {
        // Insert new team
        await db.insert(fantasyTeams).values({
          id: teamId,
          ...teamData,
        });
        result.inserted++;
      }
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        team: fantraxTeam.name,
        error: error.message,
      });
    }
  }

  return result;
}
