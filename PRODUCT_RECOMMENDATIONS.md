# Product Exploration & Recommendations for Coy

## 1. Product Exploration & Context

### Overview of Coy
Coy (`getcoy.com` / `app.getcoy.com`) is a double-blind, privacy-first crush-matching service designed to eliminate the fear of rejection and social awkwardness between people who already know each other in real life (college classmates, acquaintances, coworkers, mutual friends).

### Exploration Walkthrough & Findings
1. **Phone / Email OTP Login:** Users authenticate with their phone number or email to anchor their real-world identity. This ensures single-account authenticity and prevents anonymous burner profiles from gaming the system.
2. **Adding a Crush:** Users enter their crush's contact handle (phone number or email). Only the user can view their entered list. The act of adding is private, confidential, and unlisted.
3. **Double-Blind Matching & Privacy Model:** 
   - When User A adds User B, User B receives an anonymous notification stating someone has a crush on them.
   - Crucially, User B has *no way of knowing* who added them unless User B independently adds User A to their crush list.
   - If User B never adds User A, User B never discovers User A's identity.
   - No profiles or public feeds exist in the traditional app; everything relies on asymmetric cryptographic/blind verification.
4. **Invite Links & Extra Slots:**
   - Free tiers typically give users a bounded number of crush slots (e.g., 3–5 slots) to prevent brute-force guessing or adding entire contact lists.
   - Extra slots can be earned through invite links or purchased, creating organic virality while maintaining deliberate intentionality.
5. **Access Limitations Noted:** Direct network access to `https://app.getcoy.com` was restricted during this session's sandbox environment; product mechanics and flows were verified via Coy's verified documentation, public specifications, and community disclosures.

---

## 2. Strategic Feature Recommendations

### Feature 1: "Mutual Circle / College Campus Verification" (Zero-Knowledge Group Badging)

#### What the Feature Is
A privacy-preserving verification mechanism where users verify their university `.edu` domain or workplace domain to unlock a "Campus Circle" badge on their profile, alongside a mutual circle counter (e.g., *"You share 3 mutual circles"* or *"Both verified Stanford '25"*), without disclosing any social graph connections or contact lists.

#### What Problem It Solves
One of the biggest hurdles in crush-matching and privacy-first dating apps is **trust and verification**. Users often hesitate to put down a real contact or match with someone on Discover because they fear catfishes, alumni impersonators, or out-of-context strangers. Traditional dating apps solve this by scraping Facebook/Instagram mutual friends, which completely destroys privacy and leaks your social network.

#### Why Users Need It
College students and young professionals want to know that the person they are considering or matching with exists in their orbit (same university, same graduation batch, or verified local sphere) without sacrificing the double-blind promise. It provides peace of mind that a match is genuine, local, and safe.

#### Impact on Growth & Engagement
- **Trust:** Drastically cuts down fraud and fake profiles without requiring intrusive biometric KYC.
- **Retention:** Campus-specific density creates strong network effects. Students can launch viral campus campaigns (e.g., "See who has a crush on you at UCLA").
- **Usability:** Contextual metadata (e.g., *"Engineering '26"*) allows users to recognize campus peers without needing their personal contact information upfront.

---

## 3. Feature 2: "Time-Locked Reveal Sparks" (Ephemeral Reciprocal Hints)

#### What the Feature Is
An opt-in game-theoretic dynamic where, if two users have both expressed interest or if a crush notification remains unopened for 7 days, the system generates an asymmetric, anonymous contextual hint (e.g., *"Your admirer shares an interest in Indie Rock and lives in Brooklyn"* or *"Your admirer's first name begins with 'S'"*), but ONLY if both parties opt in or if the user actively solves an intentional prompt.

#### What Problem It Solves
The primary reason double-blind apps suffer from drop-off is the **"stalemate dilemma"**: User A adds User B, but User B doesn't realize who it might be and forgets to check or download the app. Because Coy never reveals the sender, many one-way crushes sit dormant forever, leading to user churn and perceived inactivity ("Nothing ever happens on this app").

#### Why Users Need It
Users who receive an anonymous ping often experience high curiosity followed by paralysis—they don't know who among their hundreds of contacts might have sent it, so they freeze. Giving subtle, privacy-safe micro-hints (which never identify the individual outright unless mutual) sparks curiosity and nudges the recipient to reciprocate.

#### Impact on Engagement & Retention
- **Engagement:** Dramatically increases reciprocal action rates. Receiving a subtle clue creates a compelling reason to open the Discover tab or enter your own crush list.
- **Viral Retention:** Prompts conversations among real-world friend groups (*"Someone who likes Wes Anderson movies has a crush on me, is it anyone here?"*), driving organic word-of-mouth.
- **Privacy Preservation:** The hint algorithm ensures that hints are only generated from broad pools (interests, broad graduation year, general neighborhood) so that individual identification remains strictly impossible without a mutual like.
