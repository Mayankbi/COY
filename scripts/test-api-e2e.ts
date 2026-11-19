import assert from 'assert';
import http from 'http';
import { NextRequest } from 'next/server';
import { GET as getFeed } from '../app/api/feed/route';
import { POST as postSwipe } from '../app/api/swipe/route';
import { GET as getMatches } from '../app/api/matches/route';
import { POST as postReset } from '../app/api/reset/route';

async function runEndToEndApiTests() {
  console.log('🚀 Running Full-Stack Route & API QA Integration Tests...\n');

  // 1. Reset state
  const resetRes = await postReset();
  const resetData = await resetRes.json();
  assert.strictEqual(resetRes.status, 200);
  assert.strictEqual(resetData.success, true);
  console.log('✅ 1. POST /api/reset returns 200 and confirms clean state reset.');

  // 2. GET /api/feed
  const feedRes = await getFeed();
  const feedData = await feedRes.json();
  assert.strictEqual(feedRes.status, 200);
  assert.strictEqual(feedData.success, true);
  assert.strictEqual(feedData.profiles.length, 30);
  console.log(`✅ 2. GET /api/feed returns 200 with all 30 profiles.`);

  // 3. POST /api/swipe - Validation Tests
  // 3a. Bad payload (missing profileId)
  const badReq1 = new NextRequest('http://localhost:3000/api/swipe', {
    method: 'POST',
    body: JSON.stringify({ action: 'like' })
  });
  const badRes1 = await postSwipe(badReq1);
  assert.strictEqual(badRes1.status, 400);
  console.log('✅ 3a. POST /api/swipe with missing profileId returns 400 Bad Request.');

  // 3b. Bad action
  const badReq2 = new NextRequest('http://localhost:3000/api/swipe', {
    method: 'POST',
    body: JSON.stringify({ profileId: 'user-01', action: 'superlike' })
  });
  const badRes2 = await postSwipe(badReq2);
  assert.strictEqual(badRes2.status, 400);
  console.log('✅ 3b. POST /api/swipe with invalid action returns 400 Bad Request.');

  // 3c. Non-existent profile
  const badReq3 = new NextRequest('http://localhost:3000/api/swipe', {
    method: 'POST',
    body: JSON.stringify({ profileId: 'user-ghost-999', action: 'like' })
  });
  const badRes3 = await postSwipe(badReq3);
  assert.strictEqual(badRes3.status, 404);
  console.log('✅ 3c. POST /api/swipe on non-existent profile returns 404 Not Found.');

  // 4. Pass an admirer ('user-01')
  const passReq = new NextRequest('http://localhost:3000/api/swipe', {
    method: 'POST',
    body: JSON.stringify({ profileId: 'user-01', action: 'pass' })
  });
  const passRes = await postSwipe(passReq);
  const passData = await passRes.json();
  assert.strictEqual(passRes.status, 200);
  assert.strictEqual(passData.isMatch, false);
  assert.strictEqual(passData.match, undefined);
  console.log('✅ 4. POST /api/swipe pass on pre-liker produces no match and reveals no admirer info.');

  // 5. Duplicate swipe rejection
  const dupReq = new NextRequest('http://localhost:3000/api/swipe', {
    method: 'POST',
    body: JSON.stringify({ profileId: 'user-01', action: 'pass' })
  });
  const dupRes = await postSwipe(dupReq);
  assert.strictEqual(dupRes.status, 409);
  console.log('✅ 5. Duplicate swipe on user-01 is rejected with 409 Conflict.');

  // 6. Mutual Like Test on user-03
  const likeReq = new NextRequest('http://localhost:3000/api/swipe', {
    method: 'POST',
    body: JSON.stringify({ profileId: 'user-03', action: 'like' })
  });
  const likeRes = await postSwipe(likeReq);
  const likeData = await likeRes.json();
  assert.strictEqual(likeRes.status, 200);
  assert.strictEqual(likeData.isMatch, true);
  assert.strictEqual(likeData.match.profile.id, 'user-03');
  console.log('✅ 6. Mutual like on user-03 returns 200 with isMatch=true and profile details.');

  // 7. GET /api/matches returns mutual match
  const matchesRes = await getMatches();
  const matchesData = await matchesRes.json();
  assert.strictEqual(matchesRes.status, 200);
  assert.strictEqual(matchesData.matches.length, 1);
  assert.strictEqual(matchesData.matches[0].profile.name, 'Maya Patel');
  console.log('✅ 7. GET /api/matches correctly returns mutual match for Maya Patel.');

  // 8. Clean up
  await postReset();
  console.log('\n🌟 ALL QA INTEGRATION API TESTS PASSED WITH 100% SUCCESS!\n');
}

runEndToEndApiTests().catch((err) => {
  console.error('QA Test Failure:', err);
  process.exit(1);
});
