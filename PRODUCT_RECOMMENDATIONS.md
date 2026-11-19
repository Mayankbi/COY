# Product Exploration & Recommendations for Coy

## 1. Real-World Product Exploration Walkthrough (`app.getcoy.com`)

Based on our direct hands-on walkthrough and video session on `https://app.getcoy.com`:

### Key User Flows Explored:
1. **Phone OTP Onboarding:**
   - User inputs their phone number (e.g. `+91 73071 75116`) and accepts 18+ terms.
   - Clean 6-digit verification code input with countdown timer and instant SMS auto-fill.
2. **Interactive Onboarding Explainer ("Ranbir & Alia"):**
   - High-fidelity visual cards showing how Ranbir adds Alia and Deepika to his confidential list (visible only to him).
   - Alia separately adds Ranbir—triggering an instant mutual match where both see it at the same moment.
3. **Core Dashboard & Crush List Management:**
   - **Hero Card:** *"Find out if your crush likes you back"* (Branded rounded card with dot-grid pattern and prominent hot pink CTA).
   - **Anonymous Crush Broadcast Alert:** Yellow notification envelope (*"Someone has a crush on you — Share it on your story to ask your crush to reveal themselves"*).
   - **Slot-Based Intentionality System:** Users start with `0/3` crush slots. Adding a crush uses 1 slot (*"Adding is final: you can't remove someone once they're on your list"*).
4. **Adding a Crush Flow:**
   - Pop-up modal: Name (e.g. *"Riya from 3rd floor"* — only you see this label), and Contact handle (Phone number or Email).
   - Instant anonymous notification dispatch to the target.
5. **Mutual Match Unlocked:**
   - When mutual interest is confirmed (e.g. Mayank & Riya), the card turns light pink with a 💖 Matched badge and a direct **"Say hi"** WhatsApp contact button.
6. **Viral Growth & Monetization:**
   - *"Get more slots"* button directing to slot purchases and invite links (*"Get a slot free by sharing invite link"*).

---

## 2. Core Feature Recommendations

### Feature 1: "Mutual Circle & Campus Verification" (Zero-Knowledge Group Badging)

#### What the Feature Is
A privacy-preserving verification mechanism allowing users to link their verified university domain (`.edu`) or corporate email to display a verified affiliation badge (e.g., *"Stanford '25"* or *"Bangalore Tech Circle"*) and mutual circle count, without leaking any contacts or social graph.

#### What Problem It Solves
On double-blind crush platforms, users often fear entering phone numbers of campus peers because of uncertainty about whether the app is active in their local sphere or whether people will recognize the notification.

#### Why Users Need It
College students and young professionals want reassurance that their crush operates in the same trusted real-world community, increasing confidence to send anonymous heads-ups.

#### Business & Growth Impact
- **Trust:** Cuts down spam/fake phone numbers significantly.
- **Viral Retention:** Campus density drives exponential word-of-mouth (e.g., "See who has a crush on you at UCLA").

---

### Feature 2: "Time-Locked Reveal Sparks" (Ephemeral Reciprocal Hints)

#### What the Feature Is
An opt-in game-theoretic clue system. If an anonymous crush notification remains unreciprocated after 5–7 days, the recipient receives a broad anonymous clue (e.g., *"Your secret admirer shares an interest in Indie Rock"* or *"Your secret admirer is in Computer Science"*).

#### What Problem It Solves
The **"stalemate dilemma"**: User A puts down User B, but User B receives a vague notification and doesn't know who among their contacts might have sent it, leading to inaction and churn.

#### Why Users Need It
Curiosity is ignited without compromising identity—a broad interest hint narrows the field just enough to encourage User B to reciprocate while maintaining 100% rejection protection.

#### Business & Growth Impact
- **Engagement:** Drastically increases the conversion of anonymous notification pings into reciprocal active users.
- **Social Virality:** Sparks real-world conversations among friend groups without revealing any personal identity unless mutual.
