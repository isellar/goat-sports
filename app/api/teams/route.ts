import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { teams } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const allTeams = await db
      .select()
      .from(teams)
      .orderBy(teams.name);

    return NextResponse.json({ teams: allTeams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

