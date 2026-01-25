import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leagues, leagueMemberships, fantasyTeams, users } from '@/lib/db/schema';
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

    const { id } = await params;

    // Verify user is a member of the league
    const [membership] = await db
      .select()
      .from(leagueMemberships)
      .where(and(
        eq(leagueMemberships.leagueId, id),
        eq(leagueMemberships.userId, user.id)
      ));

    if (!membership) {
      return NextResponse.json(
        { error: 'Forbidden: You are not a member of this league' },
        { status: 403 }
      );
    }

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

    const { id } = await params;
    const body = await request.json();

    // Get league and verify user is commissioner
    const [league] = await db
      .select()
      .from(leagues)
      .where(eq(leagues.id, id));

    if (!league) {
      return NextResponse.json(
        { error: 'League not found' },
        { status: 404 }
      );
    }

    if (league.commissionerId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: Only the commissioner can update league settings' },
        { status: 403 }
      );
    }

    // Update league
    const [updatedLeague] = await db
      .update(leagues)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(leagues.id, id))
      .returning();

    return NextResponse.json({ league: updatedLeague });
  } catch (error) {
    console.error('Error updating league:', error);
    return NextResponse.json(
      { error: 'Failed to update league' },
      { status: 500 }
    );
  }
}
