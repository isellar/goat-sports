import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leagues, leagueMemberships, fantasyTeams, users } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/server';

export async function POST(
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

    const { id: leagueId } = await params;
    const body = await request.json();
    const { teamName } = body;

    // Ensure user exists in our users table
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id));

    if (!existingUser) {
      await db.insert(users).values({
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
      });
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
          eq(leagueMemberships.userId, user.id)
        )
      );

    if (existingMembership) {
      return NextResponse.json(
        { error: 'You are already a member of this league' },
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
      userId: user.id,
    });

    // Create fantasy team
    const fantasyTeamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User';
    await db.insert(fantasyTeams).values({
      id: fantasyTeamId,
      leagueId,
      ownerId: user.id,
      name: teamName || `${displayName}'s Team`,
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
