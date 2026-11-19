import { NextRequest, NextResponse } from 'next/server';
import { MatchService } from '@/lib/match-service';
import { SwipeAction } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * POST /api/swipe
 * Processes a swipe action ('like' or 'pass').
 * Enforces privacy guarantees: non-matches reveal zero information about whether target liked user.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    const { profileId, action } = body as { profileId?: string; action?: SwipeAction };

    if (!profileId || typeof profileId !== 'string' || profileId.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Field "profileId" is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    if (!action || (action !== 'like' && action !== 'pass')) {
      return NextResponse.json(
        { success: false, error: 'Field "action" must be either "like" or "pass".' },
        { status: 400 }
      );
    }

    const result = MatchService.processSwipe(profileId.trim(), action);
    return NextResponse.json(result);
  } catch (error: any) {
    const errorMessage = error.message || 'Error processing swipe action';
    
    // Status 409 Conflict for duplicate swipes, 404 for missing profile, 400 for bad request
    if (errorMessage.includes('already swiped')) {
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 409 }
      );
    }

    if (errorMessage.includes('not found')) {
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}
