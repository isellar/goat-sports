/**
 * Admin ETL Trigger for Fantrax Data
 * POST /api/admin/etl/fantrax
 *
 * Manually trigger the Fantrax ETL pipeline to sync league data
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/server';
import { runFantraxETL } from '@/lib/etl/orchestrator';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Add admin role check
    // For now, any authenticated user can trigger ETL (development only)
    // In production, add: if (!user.isAdmin) { return 403; }

    // Get request body
    const body = await request.json();
    const {
      leagueId,
      fantraxLeagueId,
      syncRosters = true,
      clearExistingRosters = false,
    } = body;

    // Validate required params
    if (!leagueId) {
      return NextResponse.json(
        { error: 'leagueId is required' },
        { status: 400 }
      );
    }

    if (!fantraxLeagueId) {
      return NextResponse.json(
        { error: 'fantraxLeagueId is required' },
        { status: 400 }
      );
    }

    // Get Fantrax cookie from environment
    const cookie = process.env.FANTRAX_COOKIE;
    if (!cookie) {
      return NextResponse.json(
        { error: 'FANTRAX_COOKIE environment variable not set' },
        { status: 500 }
      );
    }

    // Run the ETL pipeline
    console.log(`Starting ETL for league ${leagueId} (Fantrax: ${fantraxLeagueId})`);

    const result = await runFantraxETL({
      leagueId,
      fantraxLeagueId,
      cookie,
      syncRosters,
      clearExistingRosters,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'ETL pipeline failed',
          details: result.errors,
          stats: result.stats,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      duration: result.duration,
      stats: result.stats,
      warnings: result.errors.length > 0 ? result.errors : undefined,
    });

  } catch (error: any) {
    console.error('Error in ETL endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
