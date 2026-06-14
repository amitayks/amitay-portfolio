---
name: write-linkedin-post
description: Write (or refine) a LinkedIn post about a project's progress, in Amitay's authentic voice, NDA-safe and on-positioning. Reads a project's overview.md + journal.md (the story hooks the record-progress skill captured), composes Amitay's identity + a voice protocol + a LinkedIn task method + the .rules constraints, and emits a post draft as JSON into storyboard/posts/. Has a create mode (from a hook) and a refine mode (improve an existing draft through the same voice). Use whenever turning recorded project progress into a LinkedIn post.
metadata:
  author: amitay
  version: "1.0"
---

# Write LinkedIn Post

One skill that turns recorded project progress into a LinkedIn post **in Amitay's voice** —
honest, authoritative, NDA-safe, and aimed at the people who hire senior freelance engineers.
It is the downstream partner of `record-progress`: that skill *records*, this one *writes*.

This skill does NOT invent project facts. It writes from `overview.md` + `journal.md`. If it
needs a fact that isn't recorded, it asks or flags it — it never fabricates.

---

## What this is / isn't

- **Is:** a composer. Every post is built by layering, in this order: `.rules` →
  identity → voice protocol → story selection → tell-through-identity → LinkedIn craft.
- **Isn't:** a style coat of paint applied at the end. Voice is thought *from*, not
  performed. (See Layer A.)
- **Isn't:** a megaphone for every commit. Most progress isn't a post. Silence > noise.

---

## The inputs

- **Project record** (required): `storyboard/project-overview/{Project}/overview.md` +
  `journal.md`. The journal's **Story hooks** are the raw angles.
- **Identity** (required, constant): `storyboard/identity/amitay-identity.md` (EN) and
  `amitay-identity.he.md` (HE). The engine — how Amitay's mind moves when he writes.
- **Constraints** (required, constant): `storyboard/.rules` — §4 post JSON, §6 NDA, §7
  positioning/voice/hashtags.
- **Optional:** a specific angle/hook to use, a rough draft or initial thought, an existing
  post file to refine, the post number.

## The two modes

- **Create** — given a project (and optionally a chosen hook): pick the angle, write EN + HE,
  emit a new `posts/linkedin-{subject}-{n}.json`.
- **Refine** — given an existing post file + an instruction ("punchier", "lead with the
  number", "too salesy"): re-express through the identity, update the same file.

---

## Procedure — Create mode

**1. Load the layers.** Read `.rules` (esp. §6 for this project's NDA boundary, §7
positioning), the project's `overview.md` + `journal.md`, and the identity docs. Read the
existing `posts/` for this subject so you don't repeat an angle already used.

**2. Pick the angle (story selection — Layer B).** From the journal's Story hooks + the
overview, choose candidate angles and **score them** against arc / stakes / novelty /
audience-relevance. **Default behavior: propose 2–3 candidate angles to Amitay with the
exact opening line for each and one line on why it lands — and let him pick — unless he
already named the angle.** Never silently commit to an angle.

**3. Draft English (Layers A, C, D, E).** Write the post natively in English: thought *from*
the EN identity, shaped by the LinkedIn task method and craft rules. One idea. Hook that
earns the "…see more". Plain text, scannable, proof-led, CTA = DMs open.

**4. Draft Hebrew — natively, not translated (Hebrew section).** Run the same process again
from the HE identity. This is where Amitay's real voice lives (his corpus is Hebrew-first,
code-switching English tech terms). Capture the subtleties; do not translate the English.

**5. NDA + positioning filter.** Pass both drafts through `.rules` §6 (genericize client
internals; for own projects like AgentMesh this is usually clear) and §7 (senior freelancer;
**agency stays quiet**; lead with proof; not a course-seller).

**6. Authenticity + craft check (Layer A + E).** Apply the authenticity test to each draft.
Then the craft checklist: fold, length, formatting, no body links, 3–5 end hashtags, low-
friction CTA, zero LinkedIn-cringe.

**7. Build the image block (Layer F).** Generate the post's text-free, KEISAR-CLUB-branded image: a one-line `concept`, an `alt_text`, and the structured `image-prompt-builder` `prompt`. Inherit the Visual identity; translate the post's idea into a classical/engineered object; statue only when it fits. See Layer F.

**8. Emit + report.** Write the post JSON (schema below) to
`posts/linkedin-{subject}-{n}.json`, `status: "draft"`. Record in `notes`: which journal
hook was used (so it's not reused), the NDA reasoning, and any open decisions. Then report to
Amitay: the chosen angle + why, the hook line, anything that needs his judgment, and a pointer
to preview (`serve.py` / the preview tool).

## Procedure — Refine mode

Given `{post file}` + an instruction: extract the intent, re-express through the identity
(function words, sentence architecture, emotional register, punctuation, grammar-as-identity),
run the authenticity test, re-check craft, and overwrite the file. The instruction guides
*what*; the identity governs *how*. Identity always wins over a literal reading of the
instruction (find the on-voice version of what's asked).

---

## Layer A — Voice protocol (how to wield the identity)

The identity is a **mirror, not a script.** Think *from* it; don't perform it. If a reader can
see Amitay "doing his voice," it's already lost. What shows is the thought; the voice is just
the shape the thought arrives in.

Split everything the identity gives you into two piles, treated as opposites:

- **THE FLOW — keep, always.** The cognitive rhythm. The contrastive/causal logic. The
  systems-thinking. The high-certainty epistemic stance. The setup→punchline architecture.
  The dry, pragmatic register. The personal-agency worldview. This runs on every post.
- **THE WORDS — generate fresh, every time.** The actual phrases, metaphors, the specific
  punchline, any signature tic. Never retrieved from the identity doc. The identity may *quote*
  past phrases as forensic evidence of a pattern — those are spent, not a vocabulary. Pasting
  one back = cosplaying himself.

Real people rarely fire their signature moves. Most posts carry **zero** catchphrases — at
most one, only when the moment truly earns it. Stacked signature tics read as a caricature
assembled from his own parts.

**The authenticity test** (the real one, not "could I have written this"):
> "If this exact thing happened to me right now, with no memory of anything I've ever posted,
> would THIS reaction come out of me, in THESE words?"
If the honest answer is "no, I'm reaching for something I already said," cut the borrowed part
and let the fresh reaction come. Same soul, new thought, every time.

---

## Layer B — Story selection (is this even worth a post?)

Most progress is invisible plumbing. Before writing, test the angle against four triggers:

- **Narrative arc** — is there a before→after? A problem wrestled, then resolved/decided?
  (A config bump has no arc. "The healthcheck race that kept killing the deploy" does.)
- **Emotional stakes** — did Amitay actually care? Frustration, the click of an elegant
  solution, relief, surprise. If nothing moved in him, the post will move no one.
- **Novelty** — something unexpected: a counter-intuitive call, a rare technique, a mistake
  that taught something.
- **Audience relevance** — does it speak to the people he wants as clients/peers (senior
  engineers, CTOs, founders), per the overview's positioning?

No arc, no stakes, no novelty, no relevance → don't force it. Pick a different hook.

---

## Layer C — Tell it through identity (storytelling dimensions)

Once the angle is chosen, tell it as Amitay:

- **Narrative orientation:** he's *analytical disguised as narrative*. Lead with the
  insight/decision/tradeoff, then let the story serve the mechanism — not the other way around.
- **Agency over communion:** "I built / I decided / I ripped it open and fixed the fallback."
  "I", rarely "we". This is authentic to him — use it; don't fake communal warmth.
- **Emotional register:** dry, pragmatic, certain. Pride sounds like "this actually works,"
  not "I'm thrilled." Excitement only spikes for genuine technical elegance. Don't perform
  emotions he doesn't have.
- **Framing the technical:** details serve the story. Go as deep as the audience (senior) can
  follow; the depth *is* the credibility here. Don't dumb it down to nothing.
- **Fresh words, every time.** (Layer A.)

---

## Layer D — Translating Amitay's voice to LinkedIn (the reconciliation) — READ THIS

Amitay's identity was mined mostly from **reactive** posts (replies/quotes) — his most
combative, corrective register. On LinkedIn the readers are the **clients and peers he wants**,
not opponents to dunk on. Keep the engine; re-aim it.

- **Aim the challenge at ideas, the industry, the mechanics — never at the reader.** On X:
  "the problem is you." On LinkedIn: "here's the unglamorous truth about building X that the
  hype skips." Reality-checks about *the craft*, not insults to the audience. His authority and
  contrarian instinct are an asset when pointed at the problem.
- **Authority sells; hostility doesn't.** Senior-explaining-to-peer, eye-level — not
  senior-dunking-on-junior. The `דל"פ` / unpopular-opinion move is welcome *as a sharp take on
  how software actually gets built*, not as a put-down.
- **Lead with proof.** His agency drive fits LinkedIn perfectly: "I shipped X / I made this
  call / here's what it cost." Concrete built things > abstract opinions.
- **His version of "raw" is blunt honesty about hard tradeoffs — not emotional confession.**
  Don't manufacture vulnerability. A real admitted mistake or an honest "this part is still a
  placeholder" is on-brand; a tear-jerker arc is not.
- **Disdain for fakery is on-brand and on-positioning** — it doubles as differentiation from
  the AI-hype crowd. Use it, aimed at black-box cargo-culting, never at a named person.
- **Keep it quiet about the agency** (.rules §7). Solo senior freelancer, full stop.

---

## Layer E — LinkedIn craft (durable rules — this is the platform, not the voice)

- **The hook / the fold.** Only the first ~2–3 lines (~140–210 chars) show before "…see more."
  They must earn the expand. Open on the sharpest, most concrete thing — a number, a tension, a
  contrarian claim, a vivid image. **Never** open with "I'm excited/thrilled/humbled to…".
- **Formatting = white space.** Short lines. One or two sentences per block, blank line between.
  No walls of text. **No markdown** — LinkedIn renders `**` and `#` literally; line breaks are
  your only formatting. Most readers are on a phone — keep it scannable.
- **Length.** Story posts land around **900–1,600 characters**; hard ceiling ~3,000. Long enough
  to tell it, tight enough to finish. Every line must earn the next.
- **No links in the body** — outbound URLs suppress reach. If a link is needed: "link in the
  comments." Default CTA stays **"my DMs are open."**
- **Hashtags:** 3–5, **at the very end**, specific not generic (`#SoftwareEngineering`,
  `#Cryptography`, `#Freelance`) — never inline.
- **One idea per post.** The journal has many hooks; a post spends exactly one.
- **Emoji:** at most one, only for dry irony, only if it truly earns it. Restraint reads senior.
- **End with a low-friction opening** — a genuine question peers actually answer, or "DMs open".
  Comments drive reach more than likes; bait does not ("Agree? 👇" is banned).
- **Kill LinkedIn-cringe on sight:** "thrilled/humbled to announce", broetry bait ("Let that
  sink in."), engagement-bait questions, manufactured-vulnerability arcs, motivational-poster
  lines, hollow listicles. Amitay's identity already despises these — lean on that.

---

## Layer F — The post image (KEISAR CLUB visual identity)

Every post carries ONE text-free image. Build its `image` block by following `storyboard/.rules`
§8 (the Visual identity) and the `image-prompt-builder` skill
(`/Users/amkeisar/.claude/skills/image-prompt-builder/SKILL.md` + its `references/`).

- **Inherit the constant:** pure black void + a single cold god-ray + a luminous
  marble/stone/chrome/frosted-glass subject + cinematic chiaroscuro + midnight-blue/slate-teal
  light (rare faint bronze). Near-monochrome, 4:5 portrait, gallery-grade. This never changes.
- **Vary only the subject:** translate THIS post's idea into a classical/engineered object
  (see §8's concept→object map). One focal subject in deep negative space. Use the Greco-Roman
  statue/bust ONLY when the concept fits (trust, mastery, the human ideal) — don't force it.
- **Text-free, language-agnostic:** no letters/numbers/logos — one image serves EN + HE.
- **Structured prompt:** fill `image-prompt-builder`'s 5-category JSON. For conceptual subjects,
  `apparel` and `pose_and_action` are `"n/a"`; the detail sits in `subject_parameters`,
  `environment_and_props`, `technical_specs`.
- Also write a one-line `concept` and an accessible `alt_text`.
- `filename` = `{post-id}.png` (Amitay creates the image and drops it in `images/`).
- NDA: the image is bound by `.rules` §6 too — for client posts, no identifying place/product
  imagery; use a generic metaphor.

## Hebrew — native, per language

Run Layers A–E again from `amitay-identity.he.md`, thinking *in Hebrew*. His Hebrew is the real
register: HE/EN tech-jargon hybrid in the same sentence, Israeli slang to dismiss something,
line breaks for comic/dramatic pause before the punchline ("הקמה והנחתה"). Do **not** translate
the English draft — write the Hebrew as if it were the original. Tech terms (API, tokens,
relay, X3DH) stay in English; don't force-translate them. Hebrew CTA: "ה-DM שלי פתוח" / "שלחו
הודעה".

---

## NDA & positioning — defer to `.rules`

`.rules` is the source of truth. §6: name a client only with permission, genericize their
internals, never combine a client's name with their proprietary specifics. §7: senior
end-to-end freelancer for hard problems; agency kept quiet; CTA = DMs; hashtags. For Amitay's
**own** projects (AgentMesh, visara, loop, …) there's no NDA — but still run the §7 positioning
pass. When unsure, genericize and flag it in `notes`.

---

## Output — post JSON (per `.rules` §4)

Write to `storyboard/posts/linkedin-{subject}-{n}.json`:

```json
{
  "id": "linkedin-{subject}-{n}",
  "platform": "linkedin",
  "subject": "{subject}",
  "number": {n},
  "status": "draft",
  "meta": {
    "topic": "one line",
    "goal": "what this post is for",
    "voice": "Amitay — analytical, dry, authoritative; challenge aimed at the craft",
    "cta": "DMs open",
    "primary_language": "english",
    "source": "project-overview/{Project}/overview.md",
    "hook_used": "the journal story hook this post spends (so it's not reused)"
  },
  "versions": {
    "english": { "status": "draft|approved", "body": "...", "hashtags": ["#..."] },
    "hebrew":  { "status": "draft|approved", "body": "...", "hashtags": ["#..."] }
  },
  "image": {
    "filename": "linkedin-{subject}-{n}.png",
    "concept": "one-line plain-English visual idea",
    "alt_text": "accessible description of the image for LinkedIn",
    "prompt": { "prompt_breakdown": { "subject_parameters": {}, "apparel": "n/a",
      "pose_and_action": "n/a", "environment_and_props": {}, "technical_specs": {} } }
  },
  "notes": "NDA reasoning, open decisions, which hook was spent, anything needing Amitay's call"
}
```

- `body` = exactly what gets posted: plain text, real `\n`/`\n\n` line breaks, no markdown.
- English is locked first; Hebrew adapted/native after.
- `hook_used` + `notes` are the anti-repeat memory — check them before choosing a new angle.

---

## Never do

- Never fabricate a project fact. Write only from the record; if missing, ask or flag.
- Never paste a phrase/metaphor/catchphrase out of the identity doc. Engine, not vocabulary.
- Never aim the challenge at the reader. Ideas and mechanics only.
- Never breach `.rules` §6 (NDA) or surface the agency plan (§7).
- Never open with "thrilled/humbled to announce" or end with engagement-bait.
- Never put an outbound link in the body.
- Never flatten the voice into generic-LinkedIn-professional. Authentic > polished.
- Never put text/letters/numbers/logos in the image, or break the §8 Visual identity (no
  neon/saturated/"AI"-gradient, no flat white/grey, no UI screenshots, no stock-photo humans).
- Never auto-mark a post `approved` — that's Amitay's call.
