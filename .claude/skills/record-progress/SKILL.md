---
name: record-progress
description: Record a project's progress for content/storytelling. Digs into a local project repo (architecture, patterns, git history since the last checkpoint) and writes/updates its curated overview.md plus an append-only, timestamped journal.md under storyboard/project-overview/{Project}/. Use to seed a project's record or to capture what changed since last time, so a future agent can pick up the thread and drive the next LinkedIn post. Run on demand, per project.
metadata:
  author: amitay
  version: "1.0"
---

# Record Progress

Turn the real, ongoing work in a code project into a durable, story-ready record.
This skill produces TWO artifacts per project, under
`storyboard/project-overview/{Project}/`:

- **`overview.md`** — a curated, narrative snapshot of the project (the "what & why",
  DOSE-style). The polished source a post is synthesized from. Rewritten/updated each run.
- **`journal.md`** — an **append-only**, timestamped log of progress. Each entry stamps
  the exact git range it covers and ends with a **cursor** (the last commit processed),
  so the *next* run knows "from when to start looking." Newest entry at the bottom.

These feed the LinkedIn post writer downstream. This skill only **records**; it does not
write posts.

---

## Hard rules

- **Read-only on the source repo.** Never modify, commit, stage, or delete anything under
  the project's own directory. You only run read-only git commands there and read files.
- **Write only under** `storyboard/project-overview/{Project}/`.
- **NDA / confidentiality first.** Read `storyboard/.rules` (§5 source-of-truth, §6 NDA)
  before writing. For Amitay's *own* projects there's usually no NDA, but if a project
  touches client or confidential material, genericize per `.rules` §6 and note the
  boundary at the top of its `overview.md`. When unsure, genericize.
- **Factual, not invented.** Everything in `overview.md`/`journal.md` must be grounded in
  the README, the code, or git. Don't claim capabilities the repo doesn't show.
- **`journal.md` is append-only.** Never rewrite or delete past entries. Only the
  `recorder-state` block at the top is updated in place.

---

## Inputs

Invoked as `/record-progress <project>` (or just described in chat). `<project>` may be:
- a project name that maps to `/Users/amkeisar/Keisar/Projects/<project>`, or
- an absolute path to a repo, or
- **omitted** → list the keeper subfolders under `storyboard/project-overview/` (ignore
  `Isotopia/` unless asked) and ask which one(s) to record, or offer to sweep all.

Resolve:
- `PROJECT_PATH` — the source repo (default `/Users/amkeisar/Keisar/Projects/<project>`).
- `RECORD_DIR` — `storyboard/project-overview/<project>/` (create if missing).

---

## Procedure

### 1. Orient (cheap, in main thread)
- Read `storyboard/.rules` (esp. §6) and note any confidentiality boundary for this project.
- If `RECORD_DIR/journal.md` exists, read its top `recorder-state` block to get
  `last_commit` (the **cursor**). If it doesn't exist, this is a **first run** (seed).
- Confirm `PROJECT_PATH` exists and whether it's a git repo
  (`git -C <PROJECT_PATH> rev-parse --is-inside-work-tree`).

### 2. Dig under the hood (delegate to a subagent)
Spawn ONE subagent (Agent tool, `general-purpose`) pointed at `PROJECT_PATH` with a
structured-output schema. Brief it to be **read-only** and to return data, not prose.
It should gather:

- **Identity:** what the project is (1–2 lines), its domain, current maturity
  (prototype / WIP / shipped).
- **What's built:** the real components/features that exist in the code, each with a
  status. Tie claims to files.
- **Stack & architecture:** languages, frameworks, notable structure, key patterns.
- **Decisions worth defending:** opinionated/interesting engineering choices visible in
  the code (the "I'd defend this over coffee" material).
- **Process signals:** tests (count if cheap), specs/docs, CI, commit discipline — the
  evidence of *how* the work is done.
- **Git, since the cursor:**
  - First run: summarize the whole history shape — `git -C <PROJECT_PATH> log --oneline`,
    total count, first/last dates, active branch, working-tree status.
  - Incremental run: `git -C <PROJECT_PATH> log --stat <cursor>..HEAD` and
    `git -C <PROJECT_PATH> status --short` — what changed, which areas, dirty files.
  - Always capture current `HEAD` short hash and branch → this becomes the new cursor.
- **Repo map:** the handful of dirs/files that matter.
- **Story hooks:** 3–6 concrete LinkedIn angles grounded in the above (the hard problem,
  a clever decision, a milestone, a lesson). Each hook = one sentence + why it lands.

Use a JSON schema for the subagent so the result comes back validated and parse-free.

### 3. Write `overview.md` (rewrite each run)
Curated narrative, plain markdown. Model on `project-overview/Isotopia/DOSE-Isotopia.md`,
adapted for an own-project (drop client framing). Suggested sections:

- `# {Project}` + one-line what-it-is
- `## What this is` — short, human.
- `## Why it's interesting / hard` — the angle worth talking about.
- `## What I built` — components with status (shipped / WIP / prototype).
- `## Tech & architecture` — stack + key patterns.
- `## Decisions I'd defend` — the opinionated calls.
- `## How I work, made visible` — tests, specs, commit discipline.
- `## Where it stands today` — branch, current state, what's next.
- `## Repo map` — key paths.

If a confidentiality boundary applies, add a `> NDA: see storyboard/.rules §6` note at top
and keep internals generic.

### 4. Append to `journal.md`
If first run, create the file with this header + `recorder-state` block, then the first
entry. Otherwise append a new entry at the bottom and update the `recorder-state` block.

```
<!-- recorder-state
project: {Project}
project_path: {PROJECT_PATH}
branch: {branch}
last_commit: {HEAD short hash}
last_run: {today's date YYYY-MM-DD}
-->

# {Project} — Progress Journal
Append-only. Newest entry at the bottom. Each entry stamps the git range it covers.
The `recorder-state` block above is the cursor: the next run starts from `last_commit`.
```

Entry format (first run uses "Initial snapshot"; later runs use the range):

```
---

## {YYYY-MM-DD} — {Initial snapshot | since {cursor}}
**Git:** branch `{branch}` — {first run: `{HEAD}`, {N} commits total | incremental:
`{cursor}..{HEAD}`, {N} commits}. Working tree: {clean | {n} dirty files}.
**What changed / what's there:** {2–5 bullets grounded in the diff or history}
**Patterns / architecture noticed:** {bullets}
**Decisions / lessons:** {bullets, optional}
**Story hooks (LinkedIn angles):**
- {hook} — {why it lands}
**Cursor advanced to:** `{HEAD short hash}`
```

Use today's date from the environment context (do not call a clock function). Never
fabricate a date.

### 5. Report
Tell the user, briefly:
- Whether this was a seed or incremental run, and the git range covered.
- What you wrote (paths) and the cursor's new value.
- The story hooks you surfaced (these are the handoff to the post writer).
- Anything that needs their judgment (NDA gray areas, ambiguous claims).

---

## Notes

- Keep `overview.md` tight and confident; keep `journal.md` raw and chronological.
- The cursor is the contract with future-you: an agent weeks from now reads `last_commit`,
  diffs to HEAD, and only has to reason about what's new.
- If the repo hasn't changed since the cursor, say so and append a short "no change" entry
  (or skip, your call) rather than inventing progress.
- This skill is reusable across every project and is meant to be re-run over time.
