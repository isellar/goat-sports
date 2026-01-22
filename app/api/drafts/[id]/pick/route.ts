import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { drafts, draftPicks, rosters, players, leagues } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getTeamForPick, calculateTotalPicks } from '@/lib/utils/draft';

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

    const { id: draftId } = await params;
    const body = await request.json();
    const { playerId, bidAmount } = body;

    if (!playerId) {
      return NextResponse.json(
        { error: 'playerId is required' },
        { status: 400 }
      );
    }

    // Get draft
    const [draft] = await db
      .select()
      .from(drafts)
      .where(eq(drafts.id, draftId));

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    if (draft.status !== 'in_progress') {
      return NextResponse.json(
        { error: 'Draft is not in progress' },
        { status: 400 }
      );
    }

    // Verify it's the correct team's turn
    if (!draft.currentTeamId) {
      return NextResponse.json(
        { error: 'No current team set for draft' },
        { status: 400 }
      );
    }

    // Parse draft order
    const draftOrder: string[] = draft.draftOrder ? JSON.parse(draft.draftOrder) : [];
    const expectedTeamId = getTeamForPick(draftOrder, draft.currentPick || 1);

    if (expectedTeamId !== draft.currentTeamId) {
      return NextResponse.json(
        { error: 'Not your turn to pick' },
        { status: 403 }
      );
    }

    // Check if player is already drafted
    const [existingPick] = await db
      .select()
      .from(draftPicks)
      .where(
        and(
          eq(draftPicks.draftId, draftId),
          eq(draftPicks.playerId, playerId)
        )
      );

    if (existingPick) {
      return NextResponse.json(
        { error: 'Player has already been drafted' },
        { status: 400 }
      );
    }

    // Create draft pick
    const pickId = `pick_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.insert(draftPicks).values({
      id: pickId,
      draftId,
      pickNumber: draft.currentPick || 1,
      teamId: draft.currentTeamId,
      playerId,
      bidAmount: bidAmount || null,
    });

    // Add player to roster
    await db.insert(rosters).values({
      id: `roster_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fantasyTeamId: draft.currentTeamId,
      playerId,
      lineupPosition: 'BN', // Default to bench
    });

    // Calculate next pick
    const nextPick = (draft.currentPick || 1) + 1;
    const draftOrderArray: string[] = draft.draftOrder ? JSON.parse(draft.draftOrder) : [];
    const nextTeamId = getTeamForPick(draftOrderArray, nextPick);

    // Get league to calculate total picks
    const [league] = await db
      .select()
      .from(leagues)
      .where(eq(leagues.id, draft.leagueId));

    // Calculate total picks needed (draft order array length is already total picks)
    const totalPicks = draftOrderArray.length;
    const isComplete = nextPick > totalPicks;

    // Update draft
    const updateData: any = {
      currentPick: nextPick,
      currentTeamId: nextTeamId,
      updatedAt: new Date(),
    };

    if (isComplete) {
      updateData.status = 'completed';
      updateData.completedAt = new Date();
    }

    const [updatedDraft] = await db
      .update(drafts)
      .set(updateData)
      .where(eq(drafts.id, draftId))
      .returning();

    // Get the pick with player info
    const [pick] = await db
      .select({
        pick: draftPicks,
        player: players,
      })
      .from(draftPicks)
      .innerJoin(players, eq(draftPicks.playerId, players.id))
      .where(eq(draftPicks.id, pickId));

    return NextResponse.json(
      {
        pick: {
          ...pick.pick,
          player: pick.player,
        },
        draft: updatedDraft,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error making draft pick:', error);
    return NextResponse.json(
      { error: 'Failed to make draft pick' },
      { status: 500 }
    );
  }
}
