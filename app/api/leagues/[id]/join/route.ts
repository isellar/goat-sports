import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leagues, leagueMemberships, fantasyTeams } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';

export async function POST(
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
    const body = await request.json();
    const { userId, teamName } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Check if league exists
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

    // Check if user is already a member
    const [existingMembership] = await db
      .select()
      .from(leagueMemberships)
      .where(
        and(
          eq(leagueMemberships.leagueId, leagueId),
          eq(leagueMemberships.userId, userId)
        )
      );

    if (existingMembership) {
      return NextResponse.json(
        { error: 'User is already a member of this league' },
        { status: 400 }
      );
    }

    // Check if league is full
    const [memberCount] = await db
      .select({ count: count() })
      .from(leagueMemberships)
      .where(eq(leagueMemberships.leagueId, leagueId));

    if (memberCount.count >= (league.maxTeams || 12)) {
      return NextResponse.json(
        { error: 'League is full' },
        { status: 400 }
      );
    }

    // Add membership
    const membershipId = `membership_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.insert(leagueMemberships).values({
      id: membershipId,
      leagueId,
      userId,
    });

    // Create fantasy team
    const fantasyTeamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.insert(fantasyTeams).values({
      id: fantasyTeamId,
      leagueId,
      ownerId: userId,
      name: teamName || `Team ${userId.slice(0, 8)}`,
    });

    return NextResponse.json(
      { message: 'Successfully joined league', teamId: fantasyTeamId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error joining league:', error);
    return NextResponse.json(
      { error: 'Failed to join league' },
      { status: 500 }
    );
  }
}
