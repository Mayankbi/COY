# Coy — Privacy-First Crush Matching Application

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![QA Tests](https://img.shields.io/badge/QA%20Tests-100%25%20Passing-emerald)](scripts/test-privacy-and-matching.ts)

A standalone, privacy-first crush-matching application built for the **Coy SDE Intern Assignment**. 

Coy enables double-blind crush matching where **a user never knows who liked them unless the liking is mutual**. This core privacy rule is strictly enforced at the data and API levels.

---

## 📸 Overview & Architecture

### Core Design Philosophy: Zero Knowledge & Double-Blind
- **Mobile-First Luxury UI:** Built with fluid gestures (drag, swipe, keyboard controls) and clean typography.
- **Strict Asymmetric Privacy:** Feed endpoints strip all incoming-like metadata. A pass or a one-sided like produces identical zero-knowledge responses.
- **Deterministic Mock Seed:** 30 realistic profiles with curated bios, college/city origins, and interest tags.
- **Atomic State Persistence:** Durable JSON storage with atomic write transitions and re-entrant safety.

```
                    ┌──────────────────────────┐
                    │     Client Interface     │
                    │   (Next.js App Router)   │
                    └────────────┬─────────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           ▼                     ▼                     ▼
     GET /api/feed       POST /api/swipe        GET /api/matches
   [Strictly Blind]    [Atomic Transaction]    [Confirmed Mutual]
           │                     │                     │
           └─────────────────────┼─────────────────────┘
                                 ▼
                     ┌───────────────────────┐
                     │     MatchService      │
                     │  - Privacy Firewall   │
                     │  - Double-Blind Check │
                     └───────────┬───────────┘
                                 ▼
                     ┌───────────────────────┐
                     │ Atomic JSON Datastore │
                     │   (Data / Swipes /    │
                     │    Mutual Matches)    │
                     └───────────────────────┘
```

---

## 🚀 Key Features

### 1. Home Tab
- Minimal, clean placeholder showcasing Coy's privacy pledge and quick navigation to Discover.

### 2. Discover Tab (Core Feature)
- **Single Card Feed:** Presents one profile at a time with full-bleed photos, names, ages, locations, and interests.
- **Fluid Gesture Swiping:**
  - Drag or flick Right to **LIKE** (Emerald indicator).
  - Drag or flick Left to **PASS** (Rose indicator).
  - Interactive card tilt and rotation dynamics during touch or mouse drag.
  - Spring-back animation on cancelled gestures.
  - Smooth fly-away exit animation on completed swipes.
- **Hardware & Keyboard Support:**
  - `→` (Right Arrow): Like
  - `←` (Left Arrow): Pass
  - `↑` (Up Arrow) or `Space`: Open detailed bio & overview.
- **Profile Details Modal:** Deep-dive modal revealing full bio, campus/city tags, and passions without cluttering the deck.
- **Empty State:** Friendly end-of-feed screen confirming all swipes were recorded privately, with a one-click demo restart.

### 3. Mutual Matching
- Instant animated match modal (**"It's a Match!"**) triggered **only** when both users like each other.
- Matches view listing all confirmed mutual connections with photos, timestamps, and simulated direct-connect prompts.

---

## 🔒 Privacy Safeguards & Guarantees

The core tenet of Coy is that **unrequited feelings are never exposed**:

| Scenario | What Coy Backend Does | What the Client Receives |
| :--- | :--- | :--- |
| **Feed Browsing** | Filters out previously swiped profiles; maintains stable seed order | Only public fields (`id`, `name`, `age`, `photo`, `bio`, `location`, `interests`). **Zero incoming-like fields.** |
| **Passing an Admirer** | Records pass atomically; checks that action is pass | `{ success: true, action: "pass", isMatch: false }`. **Admirer identity is permanently shielded.** |
| **Passing a Non-Admirer** | Records pass atomically | Identical response: `{ success: true, action: "pass", isMatch: false }`. |
| **Liking a Non-Admirer** | Records like atomically | `{ success: true, action: "like", isMatch: false }`. |
| **Liking an Admirer** | Confirms mutual interest; records match atomically | `{ success: true, action: "like", isMatch: true, match: { ... } }`. |
| **Replay / Duplicate** | Checks existing swipe records | Rejects with `409 Conflict`. Prevents tampering or vote manipulation. |

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.7 (Strict mode, full type-safety, zero `any` shortcuts)
- **Styling:** Tailwind CSS v4 (Modern dark-mode aesthetic with custom animations)
- **Icons:** Lucide React
- **Storage:** Atomic JSON Data Store (`data/db.json` with transactional write-replace mechanics)
- **Runtime:** Node.js v24 LTS

---

## 📦 Installation & Local Setup

### Prerequisites
- Node.js 18.x or later (Node 24 LTS recommended)
- npm or yarn

### 1. Clone & Install
```bash
git clone <repository-url>
cd coy
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your mobile browser or responsive dev tools.

### 3. Run Automated Tests
```bash
# Run unit & privacy assertion test suite
npx tsx scripts/test-privacy-and-matching.ts

# Run end-to-end API integration tests
npx tsx scripts/test-api-e2e.ts
```

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📡 API Reference

### 1. `GET /api/feed`
Retrieves unswiped profiles for the current user.
- **Privacy:** Incoming likes and admirer lists are completely omitted.
- **Response `200`:**
  ```json
  {
    "success": true,
    "count": 30,
    "profiles": [
      {
        "id": "user-01",
        "name": "Aanya Sharma",
        "age": 23,
        "photo": "https://images.unsplash.com/...",
        "bio": "Architecture grad @ Columbia...",
        "location": "Columbia University, NYC",
        "interests": ["Film Photography", "Architecture", "Jazz"]
      }
    ]
  }
  ```

### 2. `POST /api/swipe`
Records a user swipe action (`like` or `pass`).
- **Body:**
  ```json
  {
    "profileId": "user-03",
    "action": "like"
  }
  ```
- **Mutual Match Response `200`:**
  ```json
  {
    "success": true,
    "action": "like",
    "isMatch": true,
    "match": {
      "id": "match-demo-user-me-user-03",
      "profile": { ... },
      "matchedAt": "2026-11-19T15:30:00.000Z"
    }
  }
  ```
- **Non-Match Response `200` (Privacy Safe):**
  ```json
  {
    "success": true,
    "action": "pass",
    "isMatch": false
  }
  ```
- **Duplicate Swipe `409 Conflict`:**
  ```json
  {
    "success": false,
    "error": "You have already swiped on this profile."
  }
  ```

### 3. `GET /api/matches`
Returns all verified mutual connections.
- **Privacy:** Only profiles where **both** parties liked each other are returned.

### 4. `POST /api/reset`
Resets the demo state back to the original 30 profiles and deterministic pre-likes for testing.

---

## 👤 Single-User Demo Architecture

The application runs in standalone single-user demo mode:
- **Identity:** Fixed demo user session (`demo-user-me`).
- **Deterministic Pre-Likes:** 8 of the 30 seeded profiles (e.g., *Maya Patel*, *Chloe Dubois*, *Elena Rostova*) have already liked the demo user in the backend store.
- **Zero Configuration:** Operates cleanly out-of-the-box without requiring external auth tokens, third-party API keys, or databases.

---

## 💡 Product Recommendations

Full analysis is documented in [`PRODUCT_RECOMMENDATIONS.md`](PRODUCT_RECOMMENDATIONS.md):
1. **Zero-Knowledge Campus & Circle Badging:** Verified `.edu` or workspace domain badges that confirm mutual social spheres without exposing contact lists or phone numbers.
2. **Time-Locked Reveal Sparks:** Ephemeral, opt-in interest hints (e.g. shared music taste or neighborhood) to solve the double-blind "stalemate dilemma" where unreciprocated crushes sit dormant.

---

## 🧪 Testing Performed

1. **Automated Unit & Privacy Suite:**
   - Feed data isolation (no incoming like metadata leaks).
   - Rejection of invalid swipe commands.
   - Verification of duplicate swipe guards (`409 Conflict`).
   - Constant-time equivalent payloads for passes on admirers vs non-admirers.
   - Mutual match verification on pre-likers vs one-sided likes.
2. **End-to-End API Route Suite:**
   - Tested HTTP routes using simulated `NextRequest` objects.
   - Tested payload validation, 400 Bad Request handling, and 404 Not Found handling.
3. **Manual Responsive & UI QA:**
   - Desktop and mobile viewports.
   - Touch drag, mouse drag, and keyboard arrow keys.
   - Match modal popups and smooth state transitions.

---

## 🚢 Publishing to GitHub

```bash
git init
git add .
git commit -m "feat: complete Coy crush-matching full-stack application"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```
