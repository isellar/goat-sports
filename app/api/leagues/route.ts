import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leagues, leagueMemberships, fantasyTeams, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/server';

export async function GET(request: NextRequest) {
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

    // Return leagues for the authenticated user
    const userLeagues = await db
      .select({
        league: leagues,
        membership: leagueMemberships,
      })
      .from(leagueMemberships)
      .innerJoin(leagues, eq(leagueMemberships.leagueId, leagues.id))
      .where(eq(leagueMemberships.userId, user.id));

    return NextResponse.json({
      leagues: userLeagues.map((ul) => ({
        ...ul.league,
        joinedAt: ul.membership.joinedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching leagues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leagues' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      name,
      description,
      maxTeams = 12,
      draftType = 'snake',
      rosterSize = 20,
      scoringSettings,
      draftDate,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Ensure user exists in our users table (Supabase auth creates the auth.users record)
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id));

    if (!existingUser) {
      // Create user record in our database
      await db.insert(users).values({
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
      });
    }

    // Generate league ID
    const leagueId = `league_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create league with authenticated user as commissioner
    const [newLeague] = await db
      .insert(leagues)
      .values({
        id: leagueId,
        name,
        description: description || null,
        commissionerId: user.id,
        maxTeams,
        draftType: draftType as 'snake' | 'auction',
        rosterSize,
        scoringSettings: scoringSettings ? JSON.stringify(scoringSettings) : null,
        draftDate: draftDate ? new Date(draftDate) : null,
        status: 'draft',
      })
      .returning();

    // Add commissioner as a member
    await db.insert(leagueMemberships).values({
      id: `membership_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      leagueId: newLeague.id,
      userId: user.id,
    });

    // Create commissioner's fantasy team
    const fantasyTeamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.insert(fantasyTeams).values({
      id: fantasyTeamId,
      leagueId: newLeague.id,
      ownerId: user.id,
      name: `${name} - Commissioner`,
    });

    return NextResponse.json({ league: newLeague }, { status: 201 });
  } catch (error) {
    console.error('Error creating league:', error);
    return NextResponse.json(
      { error: 'Failed to create league' },
      { status: 500 }
    );
  }
}
