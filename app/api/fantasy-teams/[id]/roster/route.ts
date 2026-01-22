import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rosters, fantasyTeams, players, teams } from '@/lib/db/schema';
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

    const { id: teamId } = await params;

    // Verify team exists
    const [team] = await db
      .select()
      .from(fantasyTeams)
      .where(eq(fantasyTeams.id, teamId));

    if (!team) {
      return NextResponse.json(
        { error: 'Fantasy team not found' },
        { status: 404 }
      );
    }

    // Get roster with player and team info
    const rosterItems = await db
      .select({
        roster: rosters,
        player: players,
        team: teams,
      })
      .from(rosters)
      .innerJoin(players, eq(rosters.playerId, players.id))
      .leftJoin(teams, eq(players.teamId, teams.id))
      .where(eq(rosters.fantasyTeamId, teamId));

    return NextResponse.json({
      team,
      roster: rosterItems.map((item) => ({
        ...item.roster,
        player: {
          ...item.player,
          team: item.team,
        },
      })),
    });
  } catch (error) {
    console.error('Error fetching roster:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roster' },
      { status: 500 }
    );
  }
}

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

    const { id: teamId } = await params;
    const body = await request.json();
    const { playerId, lineupPosition } = body;

    if (!playerId) {
      return NextResponse.json(
        { error: 'playerId is required' },
        { status: 400 }
      );
    }

    // Verify team exists
    const [team] = await db
      .select()
      .from(fantasyTeams)
      .where(eq(fantasyTeams.id, teamId));

    if (!team) {
      return NextResponse.json(
        { error: 'Fantasy team not found' },
        { status: 404 }
      );
    }

    // Check if player is already on roster
    const [existingRoster] = await db
      .select()
      .from(rosters)
      .where(
        and(
          eq(rosters.fantasyTeamId, teamId),
          eq(rosters.playerId, playerId)
        )
      );

    if (existingRoster) {
      return NextResponse.json(
        { error: 'Player is already on this roster' },
        { status: 400 }
      );
    }

    // Get current roster size
    const currentRoster = await db
      .select()
      .from(rosters)
      .where(eq(rosters.fantasyTeamId, teamId));

    // TODO: Get league roster size limit from league settings
    // For now, allow adding players (we'll add validation later)

    // Add player to roster
    const rosterId = `roster_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const [newRoster] = await db
      .insert(rosters)
      .values({
        id: rosterId,
        fantasyTeamId: teamId,
        playerId,
        lineupPosition: lineupPosition || 'BN', // Default to bench
      })
      .returning();

    // Get full player info
    const [player] = await db
      .select({
        player: players,
        team: teams,
      })
      .from(players)
      .leftJoin(teams, eq(players.teamId, teams.id))
      .where(eq(players.id, playerId));

    return NextResponse.json(
      {
        roster: {
          ...newRoster,
          player: {
            ...player.player,
            team: player.team,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding player to roster:', error);
    return NextResponse.json(
      { error: 'Failed to add player to roster' },
      { status: 500 }
    );
  }
}
