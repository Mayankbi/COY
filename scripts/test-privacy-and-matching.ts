import assert from 'assert';
import { MatchService } from '../lib/match-service.js';
import { resetDatabase } from '../lib/db.js';
import { INITIAL_PRE_LIKED_PROFILES } from '../lib/seed-data.js';

console.log('🧪 Starting Privacy & Matching Logic Tests...\n');

// 1. Reset database to clean initial state
resetDatabase();
console.log('✅ 1. Database successfully reset to initial seed state.');

// 2. Feed Privacy Tests
const feed = MatchService.getFeedProfiles();
assert.strictEqual(feed.length, 30, 'Feed should contain 30 seeded profiles.');

// Privacy check: Ensure no profile in the feed has any leak of whether they liked the user
feed.forEach((profile) => {
  assert.strictEqual((profile as any).likedYou, undefined, 'Feed must never contain likedYou field!');
  assert.strictEqual((profile as any).likesUser, undefined, 'Feed must never contain likesUser field!');
  assert.strictEqual((profile as any).incoming, undefined, 'Feed must never contain incoming field!');
  assert.ok(profile.id, 'Profile must have an ID');
  assert.ok(profile.name, 'Profile must have a Name');
});
console.log('✅ 2. Feed Privacy verified: zero incoming-like fields or indicators exposed.');

// 3. Privacy Test: Passing a profile that pre-liked the user
// 'user-01' pre-liked demo-user
assert.ok(INITIAL_PRE_LIKED_PROFILES.includes('user-01'), 'user-01 should be a pre-liker');

const passPreLikerResult = MatchService.processSwipe('user-01', 'pass');
assert.strictEqual(passPreLikerResult.success, true);
assert.strictEqual(passPreLikerResult.action, 'pass');
assert.strictEqual(passPreLikerResult.isMatch, false, 'Passing an admirer MUST NOT produce a match!');
assert.strictEqual(passPreLikerResult.match, undefined, 'Passing an admirer MUST NOT reveal match info!');
console.log('✅ 3. Privacy verified: Passing an admirer produces no match and reveals nothing.');

// 4. Privacy Test: Passing a profile that did NOT pre-like the user
// 'user-02' did NOT pre-like demo-user
assert.ok(!INITIAL_PRE_LIKED_PROFILES.includes('user-02'), 'user-02 is NOT a pre-liker');

const passNonLikerResult = MatchService.processSwipe('user-02', 'pass');
assert.strictEqual(passNonLikerResult.success, true);
assert.strictEqual(passNonLikerResult.action, 'pass');
assert.strictEqual(passNonLikerResult.isMatch, false);
assert.strictEqual(passNonLikerResult.match, undefined);

// Ensure identical response structure for both passes (constant-time equivalent privacy safety)
assert.deepStrictEqual(passPreLikerResult, passNonLikerResult, 'Passing must return identical response regardless of whether target liked user.');
console.log('✅ 4. Privacy verified: Identical privacy-safe response whether swiping pass on admirer or non-admirer.');

// 5. Matching Test: Liking someone who did NOT pre-like the user
// 'user-04' did not pre-like demo-user
const likeNonLikerResult = MatchService.processSwipe('user-04', 'like');
assert.strictEqual(likeNonLikerResult.success, true);
assert.strictEqual(likeNonLikerResult.action, 'like');
assert.strictEqual(likeNonLikerResult.isMatch, false, 'One-sided like must NOT create a match!');
assert.strictEqual(likeNonLikerResult.match, undefined, 'One-sided like must not return match payload!');
console.log('✅ 5. Matching verified: One-sided like does not create a match.');

// 6. Matching Test: Liking someone who DID pre-like the user
// 'user-03' pre-liked demo-user
const likePreLikerResult = MatchService.processSwipe('user-03', 'like');
assert.strictEqual(likePreLikerResult.success, true);
assert.strictEqual(likePreLikerResult.action, 'like');
assert.strictEqual(likePreLikerResult.isMatch, true, 'Mutual like MUST create a match!');
assert.ok(likePreLikerResult.match, 'Match details must be populated for mutual like.');
assert.strictEqual(likePreLikerResult.match?.profile.id, 'user-03');
console.log('✅ 6. Matching verified: Mutual like successfully triggers match with details.');

// 7. Matches API Privacy Test
const matches = MatchService.getMatches();
assert.strictEqual(matches.length, 1, 'There should be exactly 1 confirmed mutual match.');
assert.strictEqual(matches[0]?.profile.id, 'user-03');
console.log('✅ 7. Matches API verified: Only confirmed mutual matches returned (user-03).');

// 8. Feed Exclusion Test
// Profiles user-01, user-02, user-03, user-04 were swiped; they must no longer appear in feed
const updatedFeed = MatchService.getFeedProfiles();
assert.strictEqual(updatedFeed.length, 26, 'Feed should now have 26 profiles left.');
const swipedIds = ['user-01', 'user-02', 'user-03', 'user-04'];
updatedFeed.forEach((p) => {
  assert.ok(!swipedIds.includes(p.id), `Swiped profile ${p.id} must not appear in feed!`);
});
console.log('✅ 8. Feed Exclusion verified: Swiped profiles are cleanly excluded from subsequent feeds.');

// 9. Rejection of Duplicate Swipes Test
let duplicateRejected = false;
try {
  MatchService.processSwipe('user-03', 'like');
} catch (err: any) {
  if (err.message.includes('already swiped')) {
    duplicateRejected = true;
  }
}
assert.ok(duplicateRejected, 'Duplicate swipe must be strictly rejected with an error!');
console.log('✅ 9. Edge-case verified: Duplicate swipes are rejected.');

// 10. Rejection of Invalid Profile or Action
let invalidActionRejected = false;
try {
  MatchService.processSwipe('user-05', 'superlike' as any);
} catch (err) {
  invalidActionRejected = true;
}
assert.ok(invalidActionRejected, 'Invalid swipe action must be rejected!');

let nonExistentProfileRejected = false;
try {
  MatchService.processSwipe('non-existent-user-xyz', 'like');
} catch (err) {
  nonExistentProfileRejected = true;
}
assert.ok(nonExistentProfileRejected, 'Non-existent profile must be rejected!');
console.log('✅ 10. Edge-case verified: Invalid actions and missing profiles properly rejected.');

// Clean up: Reset back to pristine demo state
resetDatabase();
console.log('✅ 11. Database cleanly reset back to pristine state for live demo.\n');
console.log('🎉 ALL 11 PRIVACY, MATCHING, AND INTEGRITY TESTS PASSED SUCCESSFULLY!\n');
