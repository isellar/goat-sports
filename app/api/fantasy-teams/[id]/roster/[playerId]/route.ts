import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rosters, fantasyTeams } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; playerId: string }> }
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

    const { id: teamId, playerId } = await params;

    // Verify team exists and user owns it
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

    if (team.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not own this team' },
        { status: 403 }
      );
    }

    // Find and delete roster entry
    const [deletedRoster] = await db
      .delete(rosters)
      .where(
        and(
          eq(rosters.fantasyTeamId, teamId),
          eq(rosters.playerId, playerId)
        )
      )
      .returning();

    if (!deletedRoster) {
      return NextResponse.json(
        { error: 'Player not found on roster' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Player removed from roster' });
  } catch (error) {
    console.error('Error removing player from roster:', error);
    return NextResponse.json(
      { error: 'Failed to remove player from roster' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; playerId: string }> }
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

    const { id: teamId, playerId } = await params;
    const body = await request.json();
    const { lineupPosition } = body;

    if (!lineupPosition) {
      return NextResponse.json(
        { error: 'lineupPosition is required' },
        { status: 400 }
      );
    }

    // Verify team exists and user owns it
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

    if (team.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not own this team' },
        { status: 403 }
      );
    }

    // Update roster entry
    const [updatedRoster] = await db
      .update(rosters)
      .set({
        lineupPosition,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(rosters.fantasyTeamId, teamId),
          eq(rosters.playerId, playerId)
        )
      )
      .returning();

    if (!updatedRoster) {
      return NextResponse.json(
        { error: 'Player not found on roster' },
        { status: 404 }
      );
    }

    return NextResponse.json({ roster: updatedRoster });
  } catch (error) {
    console.error('Error updating roster:', error);
    return NextResponse.json(
      { error: 'Failed to update roster' },
      { status: 500 }
    );
  }
}
