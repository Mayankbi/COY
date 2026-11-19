import { getDatabase, saveDatabase, DEMO_USER_ID, resetDatabase } from './db';
import { Profile, SwipeAction, SwipeRecord, MatchRecord, SwipeResponse } from './types';

/**
 * Service managing all matching logic and strict privacy guarantees.
 * 
 * CORE PRIVACY PROMISE:
 * "A user must never know who liked them unless the liking is mutual."
 */
export class MatchService {
  /**
   * Returns profiles for the feed that the user has not swiped on yet.
   * STRICT PRIVACY RULES:
   * 1. Never expose incoming likes or a `likedYou` flag.
   * 2. Do not sort or prioritize profiles based on whether they like the user.
   * 3. Exclude all profiles the user has already swiped on (liked or passed).
   */
  static getFeedProfiles(userId: string = DEMO_USER_ID): Profile[] {
    const db = getDatabase();

    // Collect IDs of profiles already swiped by this user
    const swipedTargetIds = new Set(
      db.swipes
        .filter((swipe) => swipe.swiperId === userId)
        .map((swipe) => swipe.targetId)
    );

    // Filter available profiles in stable seed order (never reordered by incoming likes)
    const availableProfiles = db.profiles.filter(
      (profile) => !swipedTargetIds.has(profile.id) && profile.id !== userId
    );

    // Return safe profile clones (guaranteed clean of any internal metadata)
    return availableProfiles.map((p) => ({
      id: p.id,
      name: p.name,
      age: p.age,
      photo: p.photo,
      bio: p.bio,
      location: p.location,
      interests: [...p.interests]
    }));
  }

  /**
   * Processes a swipe action (like or pass).
   * STRICT PRIVACY RULES:
   * 1. Non-match responses must NEVER reveal if the target pre-liked the user.
   * 2. Passing a profile never produces a match and reveals nothing.
   * 3. Reject duplicate swipes to prevent state tampering or replay attacks.
   * 4. Mutual matches are recorded atomically and return match info only upon mutual like.
   */
  static processSwipe(
    targetProfileId: string,
    action: SwipeAction,
    userId: string = DEMO_USER_ID
  ): SwipeResponse {
    if (!['like', 'pass'].includes(action)) {
      throw new Error("Invalid swipe action. Must be 'like' or 'pass'.");
    }

    const db = getDatabase();

    // Verify target profile exists
    const targetProfile = db.profiles.find((p) => p.id === targetProfileId);
    if (!targetProfile) {
      throw new Error(`Profile with ID '${targetProfileId}' not found.`);
    }

    // Check if user already swiped on this profile
    const existingSwipe = db.swipes.find(
      (s) => s.swiperId === userId && s.targetId === targetProfileId
    );

    if (existingSwipe) {
      throw new Error("You have already swiped on this profile.");
    }

    // 1. Record the new swipe
    const now = new Date().toISOString();
    const newSwipe: SwipeRecord = {
      swiperId: userId,
      targetId: targetProfileId,
      action,
      createdAt: now
    };
    db.swipes.push(newSwipe);

    let isMatch = false;
    let matchDetails: SwipeResponse['match'] = undefined;

    // 2. Check for mutual like ONLY if the current action is 'like'
    if (action === 'like') {
      // Check if target previously liked this user:
      // A: In seed initialLikesToUser list
      // B: Or in recorded database swipes where target liked userId
      const targetPreLiked = db.initialLikesToUser.includes(targetProfileId);
      const targetSwipedLiked = db.swipes.some(
        (s) => s.swiperId === targetProfileId && s.targetId === userId && s.action === 'like'
      );

      if (targetPreLiked || targetSwipedLiked) {
        // Mutual like confirmed! Create match if not already recorded
        isMatch = true;
        const matchId = `match-${userId}-${targetProfileId}`;

        const existingMatch = db.matches.find(
          (m) =>
            (m.userA === userId && m.userB === targetProfileId) ||
            (m.userA === targetProfileId && m.userB === userId)
        );

        if (!existingMatch) {
          const newMatchRecord: MatchRecord = {
            id: matchId,
            userA: userId,
            userB: targetProfileId,
            matchedAt: now
          };
          db.matches.push(newMatchRecord);
        }

        matchDetails = {
          id: matchId,
          profile: {
            id: targetProfile.id,
            name: targetProfile.name,
            age: targetProfile.age,
            photo: targetProfile.photo,
            bio: targetProfile.bio,
            location: targetProfile.location,
            interests: [...targetProfile.interests]
          },
          matchedAt: now
        };
      }
    }

    // Save state
    saveDatabase(db);

    // Return sanitized response:
    // When isMatch === false, response contains ONLY { success: true, action, isMatch: false }.
    // It gives ZERO indication of whether the target pre-liked the user.
    return {
      success: true,
      action,
      isMatch,
      match: matchDetails
    };
  }

  /**
   * Returns all confirmed mutual matches for the user.
   * STRICT PRIVACY RULES:
   * 1. Only return confirmed mutual matches.
   * 2. Never expose one-sided likes or admirer lists.
   */
  static getMatches(userId: string = DEMO_USER_ID) {
    const db = getDatabase();

    const userMatches = db.matches.filter(
      (m) => m.userA === userId || m.userB === userId
    );

    const result = userMatches.map((m) => {
      const partnerId = m.userA === userId ? m.userB : m.userA;
      const profile = db.profiles.find((p) => p.id === partnerId);

      if (!profile) return null;

      return {
        id: m.id,
        matchedAt: m.matchedAt,
        profile: {
          id: profile.id,
          name: profile.name,
          age: profile.age,
          photo: profile.photo,
          bio: profile.bio,
          location: profile.location,
          interests: [...profile.interests]
        }
      };
    }).filter(Boolean);

    return result;
  }

  /**
   * Resets demo state to initial seed.
   */
  static resetDemoState() {
    return resetDatabase();
  }
}
