import { NextResponse } from 'next/server';
import { MatchService } from '@/lib/match-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/matches
 * Returns list of mutual matches only.
 * Guaranteed to never leak one-sided likes or admirer details.
 */
export async function GET() {
  try {
    const matches = MatchService.getMatches();
    return NextResponse.json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error: any) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
