# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A single-page personal portfolio site built with **Vite + React 18 + Tailwind CSS v4**. Content is sourced from a Sanity CMS with dev-only fixture fallbacks. The repo contains **two independent projects** with different package managers:

- **`/`** (root) — the React/Vite frontend (npm)
- **`/backend_sanity`** — the Sanity Studio that defines the content schemas and admin UI (npm). It runs the **current Sanity Studio** (`sanity@^6.15.0`) with a content model matching what the frontend queries — see `backend_sanity/CLAUDE.md`.

## Commands

```bash
npm run dev          # Vite dev server at http://localhost:5173
npm run build        # production build to dist/
npm run preview      # preview the production build
npm test             # Vitest, run once
npm run test:watch   # Vitest, watch mode
```

Sanity Studio (from `backend_sanity/`): `npx sanity login` (one-time auth), then `npm run dev` (`sanity dev`, studio at `:3333`), `npm run build`, `npm run deploy`.

## Architecture

### Styling: Tailwind v4 tokens, not SCSS

Tailwind is wired in via the `@tailwindcss/vite` plugin (`vite.config.js`) — there's no `tailwind.config.js`; everything is CSS-first in `src/index.css`. Design tokens (`--bg`, `--surface`, `--text`, `--muted`, `--accent`, `--accent-hover`, `--border`) are plain CSS custom properties, redefined under `.dark`, then re-exposed as Tailwind color utilities via `@theme inline` (e.g. `--color-accent: var(--accent)` → use `text-accent`, `bg-bg`, `border-border` as normal utility classes). Because `@theme inline` reads the *live* variable, the same utility classes automatically repaint for dark mode — components never branch on theme in JS for color. There is no SCSS anywhere in this codebase.

### Dark mode

Class-strategy dark mode, toggled by adding/removing `.dark` on `<html>`:

- `src/context/ThemeProvider.jsx` owns the `theme` state, flips the `dark` class, and persists to `localStorage` on every change.
- `src/lib/theme.js` (`resolveInitialTheme`) picks the initial theme: stored preference wins, otherwise `prefers-color-scheme`.
- `index.html` has an inline `<script>` (before React mounts) that applies the same logic synchronously to avoid a flash of the wrong theme.
- `ThemeToggle` (in the Navbar) calls `useTheme().toggle()`.

If you touch theme init logic, keep `resolveInitialTheme` and the inline `index.html` script in sync — they intentionally duplicate the same decision so the pre-hydration paint matches React's first render.

### Composition and shared primitives

`src/main.jsx` wraps `<App>` in `ThemeProvider`. `App.jsx` is a flat list: `Navbar` + `Hero, About, Experience, Projects, Skills, Education, Contact` sections + `Footer`. There is no HOC-wrapping layer (no AppWrap/MotionWrap) — each section is a plain component that composes shared primitives directly:

- **`Section`** (`src/components/Section.jsx`) — standard `<section>` shell (id, max-width, padding, optional eyebrow/title header). Sections use this for consistent spacing/anchors instead of each rolling its own layout.
- **`Reveal`** (`src/components/Reveal.jsx`) — `motion/react` fade+slide-up on scroll into view (`whileInView`, `once: true`). This is the standard entrance animation; use it rather than ad hoc `motion.div` variants.
- **`TimelineEntry`** (`src/components/TimelineEntry.jsx`) — shared rail/node/card layout used by both Experience and Education so the two sections render identically.
- **`GlitchText`** (`src/components/GlitchText.jsx`) — the Hero's role-cycling text scrambles between words on an interval (`requestAnimationFrame`-driven), honors `prefers-reduced-motion` by snapping instead of scrambling. Cycling index math lives in `src/lib/glitch.js` (`nextIndex`) so it's unit-testable outside the animation loop.

Animation uses `motion` (the Framer Motion successor package, imported from `motion/react`), not `framer-motion`.

### Content flow: Sanity + dev fixtures

`src/lib/sanity.js` creates the Sanity `client` (project `0bxjr1em` / dataset `production`, both **defaulted** in code so a missing env var never crashes production — override via `VITE_SANITY_PROJECT_ID`/`VITE_SANITY_DATASET`) and exposes `urlFor`/`imageUrl` for resolving Sanity image refs. `src/lib/queries.js` holds the GROQ query strings (`PROFILE`, `ABOUTS`, `EXPERIENCES`, `PROJECTS`, `SKILLS`, `EDUCATION`).

Data fetching is layered:

- `useSanity(query, params)` (`src/hooks/useSanity.js`) — thin wrapper around `client.fetch`, tracks `data`/`loading`/`error`.
- `useContent(query, fixture)` (`src/hooks/useContent.js`) — calls `useSanity`, then runs the result through `pickContent` (`src/lib/content.js`): if Sanity's result is empty/null **and** `import.meta.env.DEV` is true, it falls back to a static fixture from `src/lib/fixtures.js`. **In production this fallback never fires** — an empty Sanity dataset means an empty section, by design (no fake content ever ships).

This means the site is fully browsable in local dev even with no Sanity data configured, but you should not rely on fixtures matching what's actually in production Sanity — always sanity-check (no pun intended) real content shapes against `src/lib/queries.js` when changing a section's expected fields.

`src/lib/format.js` has small presentation adapters consumed by sections: `groupByCategory` (Skills) and `formatDateRange` (Experience/Education, "Mon YYYY — Present" style).

### Contact form: Netlify Forms, no backend

`Contact.jsx` submits via a POST to `/` with `Content-Type: application/x-www-form-urlencoded`, body built by `encode()` (`src/lib/netlify.js`) — the vanilla Netlify Forms pattern, not a custom API. `index.html` contains a hidden static `<form name="contact" netlify ...>` purely so Netlify's build-time crawler can detect the form's fields (Netlify only picks up forms present in the built HTML, not ones rendered later by React). The real, interactive form in `Contact.jsx` must keep its field `name`s in sync with that hidden form. There's no server code and no Sanity write token involved in the contact flow — submissions land in Netlify's Forms dashboard, routed by email notification.

### Deploy

Netlify, custom domain `cbermeo.com`. `netlify.toml`: build `npm run build`, publish `dist`, SPA redirect (`/*` → `/index.html`), Node 20 pinned for the build environment. Getting live content and form delivery working on a fresh Netlify site also requires dashboard-side setup (public Sanity dataset, Sanity CORS origins, Netlify Forms notification email) — see `README.md` for the checklist.
