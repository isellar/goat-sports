import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leagues, fantasyTeams, rosters, players, users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { calculateFantasyPoints } from '@/lib/utils/fantasy';

interface TeamStanding {
  teamId: string;
  teamName: string;
  ownerName: string;
  ownerEmail: string;
  totalFantasyPoints: number;
  rosterSize: number;
  wins: number;
  losses: number;
  ties: number;
  winPercentage: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { id: leagueId } = await params;

    // Verify league exists
    const [league] = await db
      .select()
      .from(leagues)
      .where(eq(leagues.id, leagueId));

    if (!league) {
      return NextResponse.json(
        { error: 'League not found' },
        { status: 404 }
      );
    }

    // Get all teams in the league
    const teams = await db
      .select({
        team: fantasyTeams,
        owner: users,
      })
      .from(fantasyTeams)
      .innerJoin(users, eq(fantasyTeams.ownerId, users.id))
      .where(eq(fantasyTeams.leagueId, leagueId));

    // Calculate standings for each team
    const standings: TeamStanding[] = [];

    for (const { team, owner } of teams) {
      // Get all players on this team's roster
      const teamRoster = await db
        .select({
          roster: rosters,
          player: players,
        })
        .from(rosters)
        .innerJoin(players, eq(rosters.playerId, players.id))
        .where(eq(rosters.fantasyTeamId, team.id));

      // Calculate total fantasy points from roster
      let totalFantasyPoints = 0;
      for (const { player } of teamRoster) {
        totalFantasyPoints += calculateFantasyPoints(player);
      }

      // For now, wins/losses/ties are 0 since matchups aren't implemented yet
      // This will be updated when matchup tracking is added
      const wins = 0;
      const losses = 0;
      const ties = 0;
      const totalGames = wins + losses + ties;
      const winPercentage = totalGames > 0 ? wins / totalGames : 0;

      standings.push({
        teamId: team.id,
        teamName: team.name,
        ownerName: owner.name || 'Unknown',
        ownerEmail: owner.email,
        totalFantasyPoints: Math.round(totalFantasyPoints * 100) / 100, // Round to 2 decimals
        rosterSize: teamRoster.length,
        wins,
        losses,
        ties,
        winPercentage: Math.round(winPercentage * 1000) / 1000, // Round to 3 decimals
      });
    }

    // Sort by total fantasy points (descending), then by wins (when implemented)
    standings.sort((a, b) => {
      if (b.totalFantasyPoints !== a.totalFantasyPoints) {
        return b.totalFantasyPoints - a.totalFantasyPoints;
      }
      // Secondary sort by wins (when matchups are implemented)
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      // Tertiary sort by team name
      return a.teamName.localeCompare(b.teamName);
    });

    // Add rank to each standing
    const standingsWithRank = standings.map((standing, index) => ({
      ...standing,
      rank: index + 1,
    }));

    return NextResponse.json({
      standings: standingsWithRank,
      leagueId,
      calculatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error calculating standings:', error);
    return NextResponse.json(
      { error: 'Failed to calculate standings' },
      { status: 500 }
    );
  }
}
