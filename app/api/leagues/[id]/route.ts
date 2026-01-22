import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leagues, leagueMemberships, fantasyTeams, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

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

    const { id } = await params;

    // Get league with commissioner info
    const [league] = await db
      .select({
        league: leagues,
        commissioner: users,
      })
      .from(leagues)
      .innerJoin(users, eq(leagues.commissionerId, users.id))
      .where(eq(leagues.id, id));

    if (!league) {
      return NextResponse.json(
        { error: 'League not found' },
        { status: 404 }
      );
    }

    // Get members
    const members = await db
      .select({
        membership: leagueMemberships,
        user: users,
      })
      .from(leagueMemberships)
      .innerJoin(users, eq(leagueMemberships.userId, users.id))
      .where(eq(leagueMemberships.leagueId, id));

    // Get fantasy teams
    const teams = await db
      .select({
        team: fantasyTeams,
        owner: users,
      })
      .from(fantasyTeams)
      .innerJoin(users, eq(fantasyTeams.ownerId, users.id))
      .where(eq(fantasyTeams.leagueId, id));

    return NextResponse.json({
      league: {
        ...league.league,
        commissioner: league.commissioner,
        members: members.map((m) => ({
          ...m.user,
          joinedAt: m.membership.joinedAt,
        })),
        teams: teams.map((t) => ({
          ...t.team,
          owner: t.owner,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching league:', error);
    return NextResponse.json(
      { error: 'Failed to fetch league' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const { id } = await params;
    const body = await request.json();

    // Update league
    const [updatedLeague] = await db
      .update(leagues)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(leagues.id, id))
      .returning();

    if (!updatedLeague) {
      return NextResponse.json(
        { error: 'League not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ league: updatedLeague });
  } catch (error) {
    console.error('Error updating league:', error);
    return NextResponse.json(
      { error: 'Failed to update league' },
      { status: 500 }
    );
  }
}
