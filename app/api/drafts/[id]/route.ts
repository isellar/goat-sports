import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { drafts, draftPicks, fantasyTeams, players, teams, leagues, leagueMemberships } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
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

    const { id: draftId } = await params;

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

    // Verify user is a member of the league
    const [membership] = await db
      .select()
      .from(leagueMemberships)
      .where(and(
        eq(leagueMemberships.leagueId, draft.leagueId),
        eq(leagueMemberships.userId, user.id)
      ));

    if (!membership) {
      return NextResponse.json(
        { error: 'Forbidden: You are not a member of this league' },
        { status: 403 }
      );
    }

    // Get all picks with player and team info
    const picks = await db
      .select({
        pick: draftPicks,
        player: players,
        playerTeam: teams,
        fantasyTeam: fantasyTeams,
      })
      .from(draftPicks)
      .innerJoin(players, eq(draftPicks.playerId, players.id))
      .leftJoin(teams, eq(players.teamId, teams.id))
      .innerJoin(fantasyTeams, eq(draftPicks.teamId, fantasyTeams.id))
      .where(eq(draftPicks.draftId, draftId))
      .orderBy(asc(draftPicks.pickNumber));

    // Get current team info if available
    let currentTeam = null;
    if (draft.currentTeamId) {
      const [team] = await db
        .select()
        .from(fantasyTeams)
        .where(eq(fantasyTeams.id, draft.currentTeamId));
      currentTeam = team;
    }

    return NextResponse.json({
      draft: {
        ...draft,
        currentTeam,
      },
      picks: picks.map((p) => ({
        ...p.pick,
        player: {
          ...p.player,
          team: p.playerTeam,
        },
        fantasyTeam: p.fantasyTeam,
      })),
    });
  } catch (error) {
    console.error('Error fetching draft:', error);
    return NextResponse.json(
      { error: 'Failed to fetch draft' },
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

    const { id: draftId } = await params;
    const body = await request.json();
    const { status, currentPick, currentTeamId } = body;

    // Get draft and league to verify commissioner
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

    const [league] = await db
      .select()
      .from(leagues)
      .where(eq(leagues.id, draft.leagueId));

    if (!league) {
      return NextResponse.json(
        { error: 'League not found' },
        { status: 404 }
      );
    }

    if (league.commissionerId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: Only the commissioner can update draft settings' },
        { status: 403 }
      );
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (status !== undefined) updateData.status = status;
    if (currentPick !== undefined) updateData.currentPick = currentPick;
    if (currentTeamId !== undefined) updateData.currentTeamId = currentTeamId;
    if (status === 'in_progress' && !body.startedAt) {
      updateData.startedAt = new Date();
    }
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const [updatedDraft] = await db
      .update(drafts)
      .set(updateData)
      .where(eq(drafts.id, draftId))
      .returning();

    return NextResponse.json({ draft: updatedDraft });
  } catch (error) {
    console.error('Error updating draft:', error);
    return NextResponse.json(
      { error: 'Failed to update draft' },
      { status: 500 }
    );
  }
}
