import { NextResponse } from 'next/server';
import { MatchService } from '@/lib/match-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/feed
 * Returns safe profile feed excluding previously swiped profiles.
 * Never reveals who has liked the current user.
 */
export async function GET() {
  try {
    const feed = MatchService.getFeedProfiles();
    return NextResponse.json({
      success: true,
      count: feed.length,
      profiles: feed
    });
  } catch (error: any) {
    console.error('Error fetching feed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
