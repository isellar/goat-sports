import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leagues, leagueMemberships, fantasyTeams, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // If userId provided, return leagues for that user
    if (userId) {
      const userLeagues = await db
        .select({
          league: leagues,
          membership: leagueMemberships,
        })
        .from(leagueMemberships)
        .innerJoin(leagues, eq(leagueMemberships.leagueId, leagues.id))
        .where(eq(leagueMemberships.userId, userId));

      return NextResponse.json({
        leagues: userLeagues.map((ul) => ({
          ...ul.league,
          joinedAt: ul.membership.joinedAt,
        })),
      });
    }

    // Otherwise, return all public leagues (for now, all leagues)
    const allLeagues = await db.select().from(leagues);

    return NextResponse.json({ leagues: allLeagues });
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
      commissionerId,
      maxTeams = 12,
      draftType = 'snake',
      rosterSize = 20,
      scoringSettings,
      draftDate,
    } = body;

    if (!name || !commissionerId) {
      return NextResponse.json(
        { error: 'Name and commissionerId are required' },
        { status: 400 }
      );
    }

    // Check if user exists, create if not (for development/testing)
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, commissionerId));

    if (!existingUser) {
      // Create user for development/testing purposes
      // In production, this should be handled by authentication
      try {
        await db.insert(users).values({
          id: commissionerId,
          email: `${commissionerId}@test.local`,
          name: commissionerId.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        });
      } catch (userError: any) {
        // If user creation fails (e.g., duplicate key), continue
        // The user might have been created by another request
        console.warn('Failed to create user, may already exist:', userError.message);
      }
    }

    // Generate league ID
    const leagueId = `league_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create league
    const [newLeague] = await db
      .insert(leagues)
      .values({
        id: leagueId,
        name,
        description: description || null,
        commissionerId,
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
      userId: commissionerId,
    });

    // Create commissioner's fantasy team
    const fantasyTeamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.insert(fantasyTeams).values({
      id: fantasyTeamId,
      leagueId: newLeague.id,
      ownerId: commissionerId,
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
