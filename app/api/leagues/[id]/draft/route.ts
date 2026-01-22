import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { drafts, leagues, fantasyTeams } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateSnakeDraftOrder, shuffleDraftOrder } from '@/lib/utils/draft';

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

    const { id: leagueId } = await params;

    // Get draft for league
    const [draft] = await db
      .select()
      .from(drafts)
      .where(eq(drafts.leagueId, leagueId));

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ draft });
  } catch (error) {
    console.error('Error fetching draft:', error);
    return NextResponse.json(
      { error: 'Failed to fetch draft' },
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

    const { id: leagueId } = await params;
    const body = await request.json();
    const { pickTimeLimit } = body;

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

    // Check if draft already exists
    const [existingDraft] = await db
      .select()
      .from(drafts)
      .where(eq(drafts.leagueId, leagueId));

    if (existingDraft) {
      return NextResponse.json(
        { error: 'Draft already exists for this league' },
        { status: 400 }
      );
    }

    // Get all teams in league
    const teams = await db
      .select()
      .from(fantasyTeams)
      .where(eq(fantasyTeams.leagueId, leagueId));

    if (teams.length < 2) {
      return NextResponse.json(
        { error: 'League must have at least 2 teams to start a draft' },
        { status: 400 }
      );
    }

    // Generate draft order based on draft type
    let draftOrder: string[];
    if (league.draftType === 'snake') {
      // Shuffle teams for first round, then generate snake order
      const shuffled = shuffleDraftOrder(teams);
      draftOrder = generateSnakeDraftOrder(shuffled, league.rosterSize || 20);
    } else {
      // For auction, just shuffle (order matters less)
      const shuffled = shuffleDraftOrder(teams);
      draftOrder = shuffled.map((t) => t.id);
    }

    // Create draft
    const draftId = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const [newDraft] = await db
      .insert(drafts)
      .values({
        id: draftId,
        leagueId,
        status: 'scheduled',
        draftOrder: JSON.stringify(draftOrder),
        currentPick: 1,
        currentTeamId: draftOrder[0] || null,
        pickTimeLimit: pickTimeLimit || null,
      })
      .returning();

    return NextResponse.json({ draft: newDraft }, { status: 201 });
  } catch (error) {
    console.error('Error creating draft:', error);
    return NextResponse.json(
      { error: 'Failed to create draft' },
      { status: 500 }
    );
  }
}
