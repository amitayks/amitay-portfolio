# Non-Code Tasks — Keisar Club Platform

> **Status**: Living document. Tracks all work that must happen *outside* the codebase to launch and operate Keisar Club. None of these block writing code, but launching without them carries legal, financial, or reputational risk. Items are grouped by who owns them and roughly ordered by urgency.

---

## Legal — must be done before public launch

These items require a qualified Israeli lawyer with experience in labor law and tech contracts. Recommended single consultation covering all of them: ~3–4 hours, ~₪2,000–4,000.

### L1. Worker classification consult (highest priority)

**Question to take to the lawyer:**
> "I run an agency. I sign clients directly and engage developers — both Israeli and overseas — as per-project freelancers. Each developer is paid a fixed fee per project, issues invoices to me as an `עוסק`, sets their own hours, and is free to work for other clients. What is my exposure to a labor court reclassifying any of them as employees, and what should the contract say to minimize it?"

**Why it matters:** Israeli courts can retroactively reclassify a "freelancer" as an employee if the work pattern looks employment-like (single client, set hours, supervised work, no business risk on the worker's side). Reclassification means back-pay for benefits, social security, and severance — potentially years' worth, per worker.

**Protective signals to design into contracts and operations:**
- Dev has multiple clients (or is contractually free to).
- Dev sets their own hours and methods.
- Dev bears project risk (fixed-price, not hourly with supervision).
- Dev supplies their own tools.
- Dev can substitute someone else for the work (with approval).
- Dev issues invoices as a registered עוסק (Israeli) or equivalent (overseas).

**Action items:**
- [ ] Book consult.
- [ ] Get written opinion on classification risk for the planned model.
- [ ] Get a written list of "do not do these things" operational guidelines (e.g. "do not require a dev to log hours in your system").

### L2. Per-project freelancer contract template

**Owner:** Lawyer drafts; Amitay reviews; reused for every dev engagement.

**Must include:**
- Scope of work (filled in per project).
- Fixed fee and payment terms (e.g. 30/40/30 by milestone, NET-30 from invoice).
- Deliverables and acceptance criteria.
- IP assignment to Keisar Club on payment.
- Confidentiality (extends past contract end).
- Non-solicitation of Keisar Club's clients for N months after engagement ends (enforceability varies — lawyer advises).
- Termination clauses (both sides).
- Governing law and dispute resolution (Israeli courts vs arbitration).
- Explicit "this is NOT an employment relationship" language with the protective signals from L1 made factual.

### L3. Standard client engagement contract template

**Owner:** Lawyer drafts. Amitay may already have a freelance contract — this is a stronger agency version.

**Must include:**
- Scope, deliverables, timeline.
- Pricing and payment schedule.
- IP transfer terms (on full payment).
- Right of Keisar Club to subcontract the work (this is the legal basis for engaging devs).
- Right of Keisar Club to publicly attribute the project (with client opt-out per `clientVisibility`).
- Confidentiality (mutual).
- Limitation of liability cap (industry standard: cap = fees paid in last 12 months).
- Warranty period.
- Termination clauses.
- Governing law.

### L4. NDA template (mutual)

**Owner:** Lawyer drafts.

Used when (a) a prospective client wants to share details before signing the engagement contract, or (b) a dev needs to see project specifics before accepting an assignment. Mutual NDA covers both cases.

### L5. Privacy policy

**Owner:** Lawyer or specialized template service (e.g. iubenda, Termly) reviewed by lawyer.

**Must cover:**
- What personal data is collected (name, email, avatar, GitHub handle, resume, IP, OAuth tokens, profile changes audit).
- Why (account creation, project assignment, public attribution).
- Where it's stored (Supabase, region).
- Third-party processors (Supabase, GitHub OAuth, Google OAuth, R2 if used, email provider).
- Data retention period.
- Data subject rights: access, deletion, correction (GDPR Art. 15–17), Israeli Privacy Protection Law equivalents.
- Contact for data requests (Amitay's email).
- Cookie / tracking disclosure.

**Required by:** GitHub OAuth app review, Google OAuth verification, Israeli Privacy Protection Law, GDPR (any EU dev or visitor).

### L6. Terms of service

**Owner:** Lawyer drafts.

**Must cover:**
- Who can use the site and for what.
- Account responsibilities (one person per account, no impersonation).
- What happens if a dev's account is suspended (work-in-progress remains paid; future assignments cease).
- Public attribution rules (when and how Keisar Club may show a dev's name and work; how a dev requests removal).
- Limitation of liability for the site itself.
- Governing law.

### L7. Decision: post-leave attribution policy

**Question to settle:** When a dev leaves Keisar Club, what happens to their public profile and the projects they're attributed to?

**Recommended default (settle in writing in the contract or terms):**
- Permanent attribution: projects shipped under Keisar Club always credit the dev who built them, even after the dev leaves the network.
- The dev's profile page goes inactive (no longer publicly listed in the directory in v2) but the dev can request a redirect to a personal site.
- The dev can request removal of attribution on a specific project; granted in good faith unless it would mislead clients about who built something currently being maintained.

**Action item:**
- [ ] Add to L2 (freelancer contract) and L6 (terms).

---

## Financial / operational — needed before first paid engagement under the new model

### F1. Confirm business registration covers the new activity

**Owner:** Amitay's accountant (רואה חשבון).

**Question:** "I am currently registered as an עוסק. I want to run an agency that engages other Israeli and overseas freelancers as subcontractors and pays them. Does my current registration cover this, or do I need to incorporate (חברה בע״מ) or change my classification?"

Likely answer at small scale: עוסק is fine. As volume grows, a בע״מ becomes more attractive (limited liability, cleaner separation of personal and business finances).

### F2. Bookkeeping for subcontractor payments

**Owner:** Accountant.

When Keisar Club pays a dev:
- Israeli devs invoice Keisar Club; Keisar Club pays via bank transfer; tax handled normally.
- Overseas devs invoice Keisar Club; Keisar Club pays via Wise / Payoneer / SWIFT; Israeli withholding tax may or may not apply depending on country and treaty.

**Action item:**
- [ ] Establish a bookkeeping process: when an invoice arrives from a dev, where does it go, who reconciles it.
- [ ] Confirm withholding rules per country for the first 2–3 dev locations.

### F3. Bank account / payment rails

**Owner:** Amitay.

- Confirm the business bank account can receive international wires and send international payments.
- Open Wise Business or Payoneer Business account for cheaper FX on overseas dev payouts.

### F4. Insurance

**Owner:** Amitay + insurance broker.

Consider professional indemnity (E&O) insurance for the agency. Protects against client claims that delivered software caused them loss. Annual cost in Israel for a small agency: ~₪3,000–8,000.

**Action item:**
- [ ] Get quotes once first contract value crosses a threshold worth insuring against.

---

## Brand & content — needed before launch

### B1. Brand transition plan

**Decision already made:** Domain stays at `keisar.club`. Brand becomes "Keisar Club." Amitay remains the public face.

**Action items:**
- [ ] Logo: confirm whether the existing animated logo is the Keisar Club logo or whether a wordmark variant is needed.
- [ ] Update site copy: "I'm Amitay" → "Keisar Club" where the agency is the subject; keep first-person voice where Amitay is genuinely the speaker.
- [ ] Footer: "© Keisar Club" with Amitay's role ("Founded by Amitay Keisar").
- [ ] Update SEO metadata: site title, OG image, description.
- [ ] Update social profile bios/links to point at Keisar Club framing.

### B2. Internal SOPs (written, even if rough)

**Owner:** Amitay.

Two short docs that exist as private Notion pages — not on the site:

- **"How I evaluate a new dev"** — your gut, written down. The criteria you actually use. Becomes the basis for the v2 automated triage agent and for any future hire on the talent team.
- **"How I onboard a new project"** — the steps from "client says yes" to "first dev kicks off." Becomes the PM playbook when you're not the only PM.

Don't perfect these. Draft them, use them, edit them as reality teaches you what's wrong.

### B3. Pre-load the supply

**Owner:** Amitay.

Before launching publicly, personally invite 5–10 devs you already trust. Onboard them through the new flow. Their profiles populate the (private in v1, public in v2) roster. Their feedback shapes the form.

**Action items:**
- [ ] List the first 5–10 invitees by name.
- [ ] Send invites the day the onboarding flow goes live.
- [ ] Run a 15-minute call with each to hear what was confusing.

### B4. Launch project list

**Owner:** Amitay.

Before flipping on the new home spirals:

- [ ] List of 3+ Finished projects (probably already on the site; need to be re-tagged with the new fields).
- [ ] List of 1–3 Ongoing projects (with assigned devs and client visibility decisions per project).
- [ ] List of any Upcoming projects to display, OR confirm the Upcoming spiral launches hidden until there's something to show.

---

## Operational — establish before scale, not before launch

### O1. Communication channel with devs

**v1 reality:** Email and direct messages (WhatsApp / Telegram / wherever each dev is).

**Action items:**
- [ ] Pick a single primary channel per dev and stick to it. Avoid scattering decisions across three platforms.
- [ ] Consider a shared Notion / Linear workspace per project — not a Keisar Club platform feature, just a tool you use.

### O2. Communication channel with clients

**v1 reality:** Email + scheduled video calls. Same as today.

### O3. Dispute escalation

**v1 reality:** Disputes are handled by Amitay personally. No formal process.

**Action item:**
- [ ] Write a 1-page internal note: "If a dev disappears mid-project, here's what I do." (Pause payment, reach out via N channels over M days, then reassign.)
- [ ] Same for "If a client refuses to pay."

### O4. Spam / fraud monitoring

**v1 reality:** Invite-only, so the surface is tiny. Manual review when something looks off.

**Action item (post-launch):**
- [ ] Add an admin alert when an invite link is followed but not completed within 24h (could indicate phishing of the invite URL).

### O5. Backup and data export

**Owner:** Amitay.

**Action items:**
- [ ] Confirm Supabase project has daily backups enabled (paid plan) or set up a weekly `pg_dump` to a private bucket.
- [ ] Document how to export all dev profiles and projects in case of platform migration.

---

## Compliance — ongoing

### C1. GitHub OAuth app verification

When the app passes ~100 users, GitHub may require a verified publisher. Submit the privacy policy and terms URL.

### C2. Google OAuth app verification

Required when requesting any non-default scopes (probably not needed for v1, but verify) or when crossing user thresholds. Requires verified domain ownership and privacy policy.

### C3. GDPR data subject requests

**Owner:** Amitay.

**Action items:**
- [ ] Document the manual process for handling an access/deletion request (probably: SQL query in Supabase, export, send to user; for deletion, a soft-delete flag on the profile + removal of personal fields).
- [ ] Build into v2 a "Delete my account" button in `/me/settings`.

---

## Quick checklist — minimum viable legal/ops to launch

A short version for "what cannot be skipped":

- [ ] Lawyer consult done (L1).
- [ ] Freelancer contract template ready (L2).
- [ ] Privacy policy live on `/legal/privacy` (L5).
- [ ] Terms of service live on `/legal/terms` (L6).
- [ ] Accountant confirms current business structure works (F1).
- [ ] Brand transition copy update done (B1).
- [ ] Pre-loaded supply ready to onboard (B3).
- [ ] Launch project list confirmed (B4).
