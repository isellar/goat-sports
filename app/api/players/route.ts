import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { players, teams, games, type Team } from '@/lib/db/schema';
import { eq, and, or, like, sql, gt, inArray } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const search = searchParams.get('search') || '';
    const position = searchParams.get('position');
    const teamId = searchParams.get('teamId');
    const minPoints = searchParams.get('minPoints');
    const minGoals = searchParams.get('minGoals');
    const sortBy = searchParams.get('sortBy') || 'name'; // 'name', 'points', 'goals', 'assists'
    const sortOrder = searchParams.get('sortOrder') || 'asc'; // 'asc' or 'desc'
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build conditions
    const conditions = [];

    // Search by name
    if (search) {
      conditions.push(like(players.name, `%${search}%`));
    }

    // Filter by position
    if (position && position !== 'all') {
      conditions.push(eq(players.position, position as 'C' | 'LW' | 'RW' | 'D' | 'G'));
    }

    // Filter by team
    if (teamId && teamId !== 'all') {
      conditions.push(eq(players.teamId, teamId));
    }

    // Filter by minimum points
    if (minPoints) {
      conditions.push(sql`${players.points} >= ${parseInt(minPoints)}`);
    }

    // Filter by minimum goals
    if (minGoals) {
      conditions.push(sql`${players.goals} >= ${parseInt(minGoals)}`);
    }

    // Build order by clause
    let orderByClause;
    switch (sortBy) {
      case 'points':
        orderByClause = sortOrder === 'desc' 
          ? sql`${players.points} DESC NULLS LAST, ${players.name} ASC`
          : sql`${players.points} ASC NULLS LAST, ${players.name} ASC`;
        break;
      case 'goals':
        orderByClause = sortOrder === 'desc'
          ? sql`${players.goals} DESC NULLS LAST, ${players.name} ASC`
          : sql`${players.goals} ASC NULLS LAST, ${players.name} ASC`;
        break;
      case 'assists':
        orderByClause = sortOrder === 'desc'
          ? sql`${players.assists} DESC NULLS LAST, ${players.name} ASC`
          : sql`${players.assists} ASC NULLS LAST, ${players.name} ASC`;
        break;
      case 'plusMinus':
        orderByClause = sortOrder === 'desc'
          ? sql`${players.plusMinus} DESC NULLS LAST, ${players.name} ASC`
          : sql`${players.plusMinus} ASC NULLS LAST, ${players.name} ASC`;
        break;
      case 'position':
        orderByClause = sortOrder === 'desc'
          ? sql`${players.position} DESC, ${players.name} ASC`
          : sql`${players.position} ASC, ${players.name} ASC`;
        break;
      case 'team':
        orderByClause = sortOrder === 'desc'
          ? sql`${teams.name} DESC NULLS LAST, ${players.name} ASC`
          : sql`${teams.name} ASC NULLS LAST, ${players.name} ASC`;
        break;
      default:
        orderByClause = sortOrder === 'desc'
          ? sql`${players.name} DESC`
          : sql`${players.name} ASC`;
    }

    // Build query with join to get team info
    const query = db
      .select({
        player: players,
        team: teams,
      })
      .from(players)
      .leftJoin(teams, eq(players.teamId, teams.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    const results = await query;

    // Get total count for pagination
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(players)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const [{ count }] = await countQuery;

    // Get next games for each team (simplified - will be optimized later)
    const now = new Date();
    const teamIds = results
      .map((r) => r.player.teamId)
      .filter((id): id is string => id !== null);
    
    const nextGameByTeam = new Map<string, any>();
    
    if (teamIds.length > 0) {
      // Get upcoming games for these teams
      const upcomingGames = await db
        .select()
        .from(games)
        .where(
          and(
            or(
              ...teamIds.map((id) => eq(games.homeTeamId, id)),
              ...teamIds.map((id) => eq(games.awayTeamId, id))
            ),
            gt(games.gameDate, now),
            eq(games.status, 'scheduled')
          )
        )
        .orderBy(games.gameDate);

      // Batch fetch all teams at once instead of N+1 queries
      const uniqueTeamIds = new Set<string>();
      upcomingGames.forEach(game => {
        if (game.homeTeamId) uniqueTeamIds.add(game.homeTeamId);
        if (game.awayTeamId) uniqueTeamIds.add(game.awayTeamId);
      });
      
      const teamList = Array.from(uniqueTeamIds);
      const teamMap = new Map<string, Team>();
      
      if (teamList.length > 0) {
        const fetchedTeams = await db
          .select()
          .from(teams)
          .where(inArray(teams.id, teamList));
        
        fetchedTeams.forEach(team => teamMap.set(team.id, team));
      }

      // For each game, get team info and store the earliest game per team
      for (const game of upcomingGames) {
        const teamId = game.homeTeamId || game.awayTeamId;
        if (teamId && !nextGameByTeam.has(teamId)) {
          nextGameByTeam.set(teamId, {
            ...game,
            homeTeam: teamMap.get(game.homeTeamId) || null,
            awayTeam: teamMap.get(game.awayTeamId) || null,
          });
        }
      }
    }

    // Format response
    const formattedResults = results.map(({ player, team }) => {
      const nextGame = player.teamId ? nextGameByTeam.get(player.teamId) : null;
      return {
        ...player,
        team: team || null,
        nextGame: nextGame || null,
      };
    });

    return NextResponse.json({
      players: formattedResults,
      total: Number(count),
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}

