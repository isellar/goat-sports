import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { fantasyTeams, leagues, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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

    const { id: teamId } = await params;

    // Get team with league and owner info
    const [team] = await db
      .select({
        team: fantasyTeams,
        league: leagues,
        owner: users,
      })
      .from(fantasyTeams)
      .innerJoin(leagues, eq(fantasyTeams.leagueId, leagues.id))
      .innerJoin(users, eq(fantasyTeams.ownerId, users.id))
      .where(eq(fantasyTeams.id, teamId));

    if (!team) {
      return NextResponse.json(
        { error: 'Fantasy team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      team: {
        ...team.team,
        league: team.league,
        owner: team.owner,
      },
    });
  } catch (error) {
    console.error('Error fetching fantasy team:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fantasy team' },
      { status: 500 }
    );
  }
}
