import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { fantasyTeams, leagues, users, leagueMemberships } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Verify user is a member of the league
    const [membership] = await db
      .select()
      .from(leagueMemberships)
      .where(and(
        eq(leagueMemberships.leagueId, team.team.leagueId),
        eq(leagueMemberships.userId, user.id)
      ));

    if (!membership) {
      return NextResponse.json(
        { error: 'Forbidden: You are not a member of this league' },
        { status: 403 }
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
