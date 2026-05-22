# Design — Keisar Club Platform (v2)

> **Status**: Living document. v2 scope. Built only after v1 ships and produces real usage signal. v1 lives in `design.md`. Non-code tasks in `non-code-tasks.md`.
>
> The principle for v2: every feature here exists to **remove a manual operation that hurt in v1**, or to **complete the dev-side and client-side flows** so that the agency can run with multiple PMs, not just Amitay. If a feature here doesn't map to a real pain point from v1, push it to "later/maybe."

---

## Context

After v1, Keisar Club has:

- A working invite-only dev onboarding flow.
- A growing roster of vetted devs (private — not yet shown publicly).
- Projects categorized by status (Upcoming / Ongoing / Finished) with attribution flags.
- An admin UI that Amitay uses to do almost everything.

What v1 does **not** have, and what v2 must add to get to a fully operational dev-side and client-side flow:

- A public dev directory — devs cannot yet "be discovered" by visitors.
- A dev dashboard — devs have no view of their own ongoing/finished projects, no settings, no way to control their own attribution per project.
- A way for an already-onboarded dev to express interest in an Upcoming project.
- A client login + client-facing project view (so Amitay's inbox is not the only status update channel).
- An automated triage layer for new dev applicants — Amitay reviews 100% of profiles by hand in v1.
- A real re-verification workflow for sensitive profile changes.
- Self-serve visibility controls for both sides.

v2 closes those gaps. It does **not** add: payments, in-platform messaging, automated matching, or the Cloudflare migration. Those stay in "later/maybe" until v2 itself produces a pain signal.

---

## Goals / Non-Goals

### Goals

- Devs can see and manage everything that pertains to them, without DM-ing Amitay.
- Clients can see their project status and pay invoices without DM-ing Amitay.
- The site has a public dev directory that a visitor can browse — turning the platform into recruitment marketing for itself.
- Admin time per dev applicant drops by ~70% via automated GitHub triage.
- Sensitive profile changes (legal name, avatar) go through a soft re-verification queue.
- All visibility decisions can be made by the relevant party (dev for their attribution, client for their project), not only by admin.

### Non-Goals (v2)

- Still no on-platform messaging.
- Still no on-platform payments.
- Still no automated matching algorithm — assignment is "Amitay (or a PM) picks from a shortlist."
- Still no full self-serve client onboarding (clients are onboarded by Amitay; they get a login *after* the project is signed).
- Still on Supabase. No Cloudflare migration.
- No general public registration. Devs remain invite-only.

---

## Decisions

### Decision V2.1: Public dev directory

**Choice:** Add `/devs` as a public, paginated, filterable directory of active devs. Each card links to `/devs/:handle`.

**Per-dev page (`/devs/:handle`) shows:**
- Display name, avatar, GitHub handle, bio, links.
- Skills/tags (new field).
- Public project credits (only projects where `clientVisibility != 'hidden'` AND the dev's attribution on that project is `'named'`).
- "Available for new projects" badge if the dev has set themselves as available.

**Why public:**
- Becomes the strongest recruiting tool — "this is who you'd be working alongside."
- Becomes the strongest sales tool for clients — "look at the team you're hiring."
- Devs can link to their Keisar Club profile from their own bios; the page becomes a portfolio piece for them.

**Privacy controls:** A dev can set their profile to `directory_visibility = 'public' | 'private'`. Private profiles are still active in the system (still get assigned work) but don't appear in the directory. Default is `public` — devs opt out, not in.

### Decision V2.2: Dev dashboard

**Choice:** Add `/me` (already exists in v1 for profile editing) sub-tabs:

```
/me
├── profile        (v1 — edit profile fields)
├── projects       (v2 — list of ongoing + finished)
├── invitations    (v2 — Upcoming projects flagged "open to interest")
├── visibility     (v2 — per-project attribution overrides)
└── settings       (v2 — account, danger zone, delete account)
```

**`/me/projects` shows:**
- Two sections: Ongoing, Finished. Sorted by most recent.
- Per project: title, client (or "Confidential" if `clientVisibility='hidden'`), role on the project ("Lead", "Contributor"), dates, status, link to public case study if public.
- Even if a project is hidden publicly, it shows here as a private "I worked on this" record.

**`/me/visibility`:**
- Per project the dev was on, dev can override their attribution (`named` → `anonymized` → `hidden`).
- Cannot override above what admin/client allow (i.e. dev cannot make themselves more visible than the client allows).

### Decision V2.3: Express interest on Upcoming projects

**Choice:** On any Upcoming project case study page, a logged-in active dev sees a button: "I'm interested in this project."

**Mechanics:**
- Click → row inserted into `project_interest(project_id, dev_id, message_text, created_at)`.
- Optional 500-char message field on the form.
- Visible only to admin / managers — never to other devs.
- Admin sees a count badge on the project in admin: "5 interested."
- Dev sees their own list under `/me/invitations` (poor name — actually "interest expressed").

**Why this and not full apply/bidding:**
- Keeps the agency model: Amitay/PM still picks who actually gets the project.
- Removes the "Amitay's DMs are the only intake channel" pain.
- Doesn't reveal applicant pools to other devs (preserves the curated-network feel).

### Decision V2.4: Client login + client-facing project view

**Choice:** When Amitay creates a project, he can optionally invite the client (same invite token mechanism as v1 dev invites, but with `role='client'`). The client logs in (Google OAuth — they don't need GitHub) and sees:

```
/client
├── projects       — list of THEIR projects (not all projects)
└── settings       — manage email, notifications, visibility preferences

/client/projects/:id
   ├── status, dates, assigned devs (with consent)
   ├── deliverables / milestones (text, updated by Amitay/PM)
   ├── invoices (status only — payment is still off-platform in v2)
   └── visibility controls (toggle clientVisibility, change company logo)
```

**Why limited:**
- The client login replaces "Amitay sends a status email" — that's the pain v2 is solving.
- Not adding payments, messaging, file uploads. Each of those is its own future v3 feature.

### Decision V2.5: Automated GitHub triage agent

**Choice:** When a new dev completes onboarding, an async job:

1. Reads the dev's public GitHub via the OAuth token (already granted at login).
2. Uses an LLM call (Claude Sonnet, prompt-cached for the system prompt) to summarize: top 3 active repos, primary languages, contribution recency, code style notes from a sampled repo.
3. Saves the summary to `profiles.triage_notes` and surfaces it in the admin profile view.

**Hard rules:**
- The agent **never auto-approves or auto-rejects**. It only summarizes.
- The summary is shown alongside, not instead of, raw GitHub data.
- Amitay/PM still clicks to approve or reject every applicant.
- Cost cap: $0.20 per applicant max. Skip and warn if exceeded.

**Why a triage tool, not a scoring system:**
- LLMs over-weight README quality and writeup polish — they reward bloggers, not engineers.
- Stars and contribution graphs correlate weakly with engineering quality.
- The agent saves Amitay 15 minutes of clicking through repos. It does not replace judgment.

### Decision V2.6: Soft re-verification queue

**Choice:** When a dev edits a sensitive field — `full_name` or `avatar_url` — the change is staged, not live:

- A `pending_changes(profile_id, field, new_value, created_at)` row is inserted.
- The public-facing display continues to show the old value until Amitay/admin approves.
- Admin sees a "pending approvals" count in `/admin`.
- Other fields (bio, links, skills) update live with no review.

**Why staged for these two fields:**
- Name and avatar are the identity surface. They're the fields used in attribution screenshots, in client introductions, and in the directory. Flipping them silently is the highest-value attack/abuse vector.
- A 24-hour delay on these two is acceptable; staging everything would be operational debt.

**The audit table from v1 (`profile_audit`) still records the historical changes for everything.**

### Decision V2.7: Dev-side and client-side visibility controls (UI only — model unchanged)

The data model from v1 already supports per-side opt-in (`clientVisibility`, `devAttribution`). v2 adds the user-facing controls:

- Dev: `/me/visibility` — sees a list of projects they were on, can request a downgrade of their attribution.
- Client: `/client/projects/:id` — can toggle their company visibility on the case study.

**Conflict rule:** the most restrictive setting wins. If client says `logo_only` and dev says `hidden`, the case study shows the company logo but not the dev. If client says `hidden` and dev says `named`, the case study shows neither.

### Decision V2.8: Account deletion (GDPR / Israeli privacy law)

**Choice:** `/me/settings` includes a "Delete my account" flow:

- Two-step confirmation.
- On confirm: profile is soft-deleted (`status='deleted'`, personal fields nulled).
- Project attributions are **kept** but rendered anonymized (per the "permanent attribution" policy from non-code-tasks L7).
- Audit record of the deletion request is preserved indefinitely.

A hard-delete pathway exists but is admin-only (used for GDPR right-to-be-forgotten requests when soft-delete is insufficient).

---

## Data model — additions in v2

```
profiles                         -- v2 additions
├── directory_visibility    enum('public','private') default 'public'
├── available_for_work      boolean default true
├── skills                  text[]
├── triage_notes            text       -- LLM-generated, admin-visible only
├── triaged_at              timestamptz nullable
└── status                  enum('active','suspended','deleted')   -- 'deleted' added

project_interest                 -- new table
├── id              uuid PK
├── project_id      uuid FK -> projects.id
├── dev_id          uuid FK -> profiles.id
├── message         text
├── created_at      timestamptz default now()
└── unique(project_id, dev_id)

pending_changes                  -- new table
├── id              uuid PK
├── profile_id      uuid FK -> profiles.id
├── field           text       -- 'full_name' or 'avatar_url'
├── new_value       text
├── created_at      timestamptz default now()
├── reviewed_at     timestamptz nullable
└── reviewed_by     uuid FK -> profiles.id (nullable)

client_invites                   -- new table, mirrors dev_invites but for clients
├── id              uuid PK
├── token_hash      text
├── email           citext
├── project_id      uuid FK -> projects.id   -- pre-assigned to the project
├── invited_by      uuid FK -> profiles.id
├── created_at      timestamptz
├── expires_at      timestamptz
└── used_at         timestamptz nullable

projects                         -- v2 additions
├── milestones      jsonb        -- [{title, status, completed_at}, ...]
├── invoices        jsonb        -- [{number, amount, currency, status, issued_at, paid_at}]
└── client_id       uuid FK -> profiles.id (nullable; set when client account is created)
```

### RLS additions

| Table | Read | Write |
|---|---|---|
| `project_interest` | Admin/manager; the dev for their own rows | The dev (insert/delete own); admin |
| `pending_changes` | Admin; the dev for their own rows | Trigger only (on profile update) |
| `client_invites` | Admin only | Admin only |

`profiles` public view is updated to include `directory_visibility='public'` filter and `skills`.

---

## Routes added in v2

| Route | Access | Purpose |
|---|---|---|
| `/devs` | public | Paginated, filterable dev directory |
| `/devs/:handle` | public | Single dev profile + public project credits |
| `/me/projects` | dev | Ongoing + Finished projects the dev is on |
| `/me/invitations` | dev | "I expressed interest in" list |
| `/me/visibility` | dev | Per-project attribution downgrade |
| `/me/settings` | dev | Account settings + delete |
| `/client` | client | Client landing — list of their projects |
| `/client/projects/:id` | client | Single project status + visibility toggles |
| `/client/settings` | client | Account settings |
| `/admin/triage` | admin | Pending profile approvals + LLM triage notes |
| `/admin/interest/:project_id` | admin | List of devs who expressed interest in a project |

---

## v2 build order (proposed)

1. **Soft re-verification + pending changes queue** — small, fully internal, no UX risk. Validates the staged-change pattern before bigger surfaces use it.
2. **Dev dashboard `/me/projects` + `/me/settings`** — biggest pain reduction for existing v1 devs.
3. **Public dev directory** — turns the roster into marketing once it's worth showing off.
4. **Express interest on Upcoming** — once directory is live, devs naturally want this.
5. **Client login + client-facing project view** — once 5+ active clients exist; below that, email is fine.
6. **Automated GitHub triage agent** — once Amitay has reviewed ~20 profiles manually and knows what patterns to ask the LLM for.
7. **Dev/client self-serve visibility controls** — last, because the v1 admin controls are sufficient until there's pressure from real users to self-serve.

---

## Risks specific to v2

- **Public directory + few devs = looks empty.** Don't launch the directory until there are at least 12–15 public-opted profiles. A sparse directory damages the brand more than no directory.
- **Express interest creating dev disappointment.** If devs express interest in 5 projects and get picked for none, retention drops. Mitigation: when a project is staffed and closed to interest, send a templated "thanks, not this time" message and surface a "still being considered" status on the dev's `/me/invitations` page.
- **LLM triage drift.** Quality of the triage notes will silently degrade as GitHub patterns or LLM outputs change. Add a periodic spot-check process — Amitay re-reviews 1 in 10 from scratch and compares to what the agent said.
- **Client visibility downgrades after publication.** A client might toggle visibility from `public` to `hidden` after a case study has been live for months. Indexed by Google. The site can hide it instantly, but cached Google results persist. Document this clearly in the client settings UI.
- **Account deletion vs attribution.** The "permanent attribution" policy and the "right to be forgotten" can collide. If a dev demands hard deletion, the case studies they were attributed to need their name stripped. Build the hard-delete pathway with attribution-stripping in mind.

---

## Open questions for v2 (to revisit after v1 launch)

1. Is "express interest" the right primitive, or do we want lightweight applications with a cover note, work samples, and a soft commitment to availability windows?
2. Should the dev directory be ranked, randomized, or filterable only? Ranking creates politics; randomization is fair but feels lazy; filtering only is the safest default.
3. Do clients ever need to see *who else* worked on a Keisar Club project (i.e. browse the directory before signing)? If yes, dev directory must exist before client login. If no, the order in build can swap.
4. When do milestones / invoices stop being JSONB blobs and become first-class tables? Probably when there are 50+ active projects — JSONB is fine until then.
5. Is it worth adding skills tags before the directory, so that v1 profiles get auto-tagged from GitHub languages and the directory launches with usable filters?
