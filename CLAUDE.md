# Chapter One — V5 working notes

Digital experiences built for moments worth remembering.

This is the **V5 worktree** (`D:\STUDIO-v5`, branch `v5`, based on `fe1bd33`). The V4 lives in
`D:\STUDIO` on branch `v4` with uncommitted work and staged files of its own (including the owner's new
photos and AI images). **Never touch the V4**: no edits, no checkout/switch/stash/reset/restore/clean
there, no changes to its index, no moving its files. Copy from it when something is needed, verify the
copy (SHA-1), and say so.

**To resume work, read `docs/development/v5-handoff.md` → section "COMEÇAR AQUI" first.** The approved design,
state by state with every approved line of copy, is **`docs/design/v5/storyboard.md`**.

## Authority

1. `docs/brand/01–04` — the brand. Locked.
2. `docs/design/v5/README.md` (every approved decision, open decisions), `storyboard.md` (the approved
   page, state by state) and `direction.md` — the V5 design source.
3. `docs/design/v5/pages.md`, `interactions.md`, `assets.md`, `acceptance.md`, `roadmap.md`,
   `prompts.md` — working specification. `history.md` — rejected iterations; do not repeat them.
4. `docs/design/v5/research/` — context and evidence only.
5. V1–V4 are **not in this worktree** (removed 29 Oct 2026, owner): their documents, prototypes, code and
   media live on branch `v4` (`D:\STUDIO`). The V5 holds only V5 decisions; anything wanted from the V4 is
   brought over deliberately (copy or merge), checked, and recorded.

## What V5 is ("First Page", approved 24 Oct 2026)

**One page** (`/`): Entrance → Work → Method → About → Questions → Contact. No per-chapter pages.
- A calm, dark gallery in stone and linen tones (charcoal `#1E1D1A`, moss `#2C332D`, linen `#EEE8DD`,
  stone `#D8D0C2`); strong colour comes only from images. **Not** an evolution of the original V1–V4
  site — only its hero video is reused, re-encoded.
- **Entrance ("Through the letters")** — the visitor's local date and time; the video seen through the
  letters of CHAPTER ONE; the camera enters through the O; three oblique blades lead to the chapters.
  A tap or key completes it; scroll does nothing until the camera is through (README #85).
- **Work** (built, M5, README #43, #81–#92) — the Weddings blade grows into the stage's arch; one pinned stage,
  three chapters (Weddings, Artists, Experiences), three moments each; **scroll moves the chapters** (one screen
  each, a 12 % dead band, a stop per chapter: one stroke, one chapter — README #110), **time moves the moments** (6 s; the word fills with the chapter's tone and arrives
  empty), and **each moment shows one piece working** over the whole photograph, in a pile of cards always in
  view; every piece explained in one line. Tapping another moment goes to it, tapping the current one pauses it.
- **Method** — "Made for whoever arrives" (README #30, #35–#39, #45, #47–#49; storyboard states 7–11): the
  Work's last piece (the *On-site guide*) multiplies into **six identical template screens** while **the
  studio lights up with the visitor's hour** (a paper sweep, light from the hour's side: four prepared images);
  *No templates. No copies.* + **Make it yours** (name, optional, shown first the same on every template);
  step by step each template sheet lifts and a **live web experience** composed from the visitor's arrival
  appears beneath (desktop two by two, phone a deck of three); the featured screen is the chapter chosen at
  the entrance (Weddings by default; on the phone it opens full screen); they gather into **the cover of the
  visitor's chapter** (the name as its title); then **the studio light goes down**: on the desktop the screens
  move aside (~60 %), on the phone they leave, and one calm round light stays on *Made once, for one moment.*
  (+ *For Ana.*), the four steps and **Talk to us**. `interactions.md` §3.
- **Navigation** — the same bar and menu on every screen (README #56, #67, #69): the bar is **two islands of dark
  live glass** (iOS-style `backdrop-filter`, blur 8 px on the phone × 1.6 on the desktop, a lens at each island's rim,
  always linen ink, darkness adapting to what is really behind each island) — left *Chapter One | 03 About*, right the
  time + *Talk to us* + ≡ Menu (phone: the three rules in a circle). The menu fills the screen: a drop of the same glass
  grown by `transform: scale` (never an animated `clip-path` on the blurred element) from the menu island's right end.
- Typography: **Cormorant Garamond + Schibsted Grotesk** (approved), set in `src/fonts/index.ts`.
- Contact: **Instagram is the primary action** (*Talk to us*); the colophon also shows Telegram (README #54) (`content/v5.ts`). No forms, addresses, prices or integrations. The call to
  action is **Talk to us** — never "Start a project".

## Non-negotiables

- **No commit, push or deploy** unless the user asks for it explicitly in the session.
- **The published site never shows the FPS meter** (owner, 31 Oct 2026): `src/components/fps-meter.tsx` needs `?fps` and works
  only on `localhost` / `127.0.0.1`. Keep that guard; take the component out of `page.tsx` before launch.
- **Performance is weighed, never a hard stop** (owner, 27 Oct 2026, README #68): no technique is
  forbidden — WebGL, `backdrop-filter`, animated filters, more layers, scroll-linked or pinned scenes are
  all possible. Every animation must **consider performance**: when a choice carries a risk, **say so
  clearly when proposing it** (what it costs, on which device, the fallback), build it, and the **final
  verdict comes from measuring on the Xiaomi** — even after the owner has chosen it. The cheap default is
  transform / opacity / clip-path / SVG strokes driven by CSS; the guidance is in `interactions.md` §0.
- **Native scroll and conventional navigation by default**; motion starts from a gesture, the arrival or a
  scroll passage and never blocks content.
- **Video**: only the entrance video, re-encoded (targets ≤ 2.5 MB desktop, ≤ 1.2 MB mobile), one request,
  a poster shown at once, no video for reduced motion / Save-Data.
- **Minimum target: Xiaomi Mi 11 Lite with no lag** — measure on the device (`acceptance.md`) from the
  first prototype onward.
- **Every gesture has a visible, accessible alternative.** Nothing depends on hover. Focus visible and
  returned after dialogs. `prefers-reduced-motion` gets a designed final state. All content works
  without JavaScript.
- **A colour reveal uses one photograph** (monochrome derived from the colour frame by
  `npm run images`). Never two different frames.
- **All words live in `content/v5.ts`** (alias `@content`). Drafts are marked and approved by the owner.
- **Server components by default.** Client islands only where needed.
- **No new dependencies** without the owner's approval and a stated reason.
- **Do not invent design behaviour** the V5 documents do not state; record the gap and ask.
- Never present AI images as real client work; never invent projects, clients, numbers or prices.
- Performance and accessibility targets are **criteria to measure**, never claims.

## Images and video

- Masters: `media-src/` (git-ignored; never edited, never committed). Target structure in
  `docs/design/v5/assets.md` §5.
- Derivatives: `npm run images` → `public/media/v5/` (AVIF + JPEG). Options `--dry-run`, `--only=<id>`,
  `--out=<dir>`, `--force`; sources can declare `dir`/`file`.
- Video encodes: commands and the local ffmpeg path in `assets.md` §1.

## Validation — a change is not finished until

- `npm run typecheck`, `npm run lint` (no warnings), `npm run build` pass.
- Viewports: 1920×1080, 1440×900, 768×1024, 390×844, 320×640.
- Keyboard-only, reduced-motion and no-JavaScript passes — no-JS against `next start`, never `next dev`.
- No horizontal overflow; text readable at real size; contrast computed.
- The Xiaomi Mi 11 Lite (ADB serial `c3e8fb35`) for anything touching motion, images, layout or client code.
- State what was not verified and why (iOS Safari cannot be tested from this environment).
- **Record the tests** in `docs/development/v5-tests.md` (one section per module: what, how, numbers, not verified)
  before a module is committed (owner, 29 Oct 2026).

## Commands

```
npm run dev -- -p 3100   # V5 dev server; the V4 keeps :3000
npm run images           # image derivatives
npm run typecheck
npm run lint
npm run build
npx next start -p 3100   # production server for validation
```

`node_modules` here is the V5's own (installed with `npm ci`); it is not shared with the V4.

## Copy

`04` §12's word list is a guide, not a ban: judge each word in context. Plain, specific, unhurried
sentences. No superlatives used as claims. The site is in English.

## Conventions

- Comments explain *why* and record what was measured.
- Match the surrounding code; keep components small and readable.
