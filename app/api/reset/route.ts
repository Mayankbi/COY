import { NextResponse } from 'next/server';
import { MatchService } from '@/lib/match-service';

export const dynamic = 'force-dynamic';

/**
 * POST /api/reset
 * Resets the demo database back to its seeded state for easy testing.
 */
export async function POST() {
  try {
    MatchService.resetDemoState();
    return NextResponse.json({
      success: true,
      message: 'Demo database has been reset to initial seed state.'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reset database' },
      { status: 500 }
    );
  }
}
