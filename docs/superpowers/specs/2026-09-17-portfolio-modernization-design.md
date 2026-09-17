# Portfolio Modernization — Design Spec

**Date:** 2026-09-17
**Branch:** `redesign-vite-tailwind`
**Status:** Awaiting user review

## Goal

Modernize a ~3-year-old personal portfolio into a fast, modern, professional **resume-style** site with dark mode. Migrate the build tooling off the abandoned Create React App, replace SCSS with Tailwind v4, remove the 3D scenes, refresh the content model, and bring the Sanity backend up to date.

## Locked decisions

| Area | Decision |
|---|---|
| Build tool | Migrate CRA (`react-scripts`) → **Vite** |
| Styling | SCSS/`node-sass` → **Tailwind v4** (CSS-first config, `@tailwindcss/vite`) |
| Dark mode | **Toggle + system default**, persisted to `localStorage`, no flash of wrong theme |
| 3D scenes | **Removed** entirely |
| Redesign | **Fresh, resume-oriented** (not a restyle of the old layout) |
| Sections | Hero → About → Experience → Projects → Skills → Education → Contact |
| Visual identity | **Editorial slate** — near-monochrome slate/zinc, `blue-600` accent, Inter, minimal/timeless |
| Sanity | Full **Studio v2 → v3** migration + reworked content model |
| Deploy | **Netlify** (`vite build` → `dist/`, SPA redirect) |
| Contact form | **Netlify Forms** (recommended — removes the client-side Sanity write token) |

## Non-goals / out of scope

- No new blog/CMS-driven pages beyond the sections above.
- No i18n, no analytics stack changes (can be added later).
- No backend server; content stays in Sanity, form handling via Netlify.
- Not preserving the old visual language (dots nav, side social rail, lilac theme).

---

## Frontend architecture

### Build (Vite)
- Replace `react-scripts` with `vite` + `@vitejs/plugin-react`.
- `index.html` moves from `public/` to project root; entry becomes `src/main.jsx` (rename from `src/index.js`).
- Scripts: `dev` (`vite`), `build` (`vite build`), `preview` (`vite preview`).
- Env vars: `REACT_APP_SANITY_*` → `import.meta.env.VITE_SANITY_*`.
- Node 18+ required.

### Styling (Tailwind v4)
- `@tailwindcss/vite` plugin; single `src/index.css` with `@import "tailwindcss";`.
- Design tokens defined CSS-first in `@theme { }` (colors, fonts, spacing scale).
- Dark mode via `@custom-variant dark (&:where(.dark, .dark *));` — **class strategy** on `<html>`.
- Delete every `.scss` file and `node-sass`. Global helper classes from `App.scss` (`app__flex`, `head-text`, `p-text`, etc.) are replaced by Tailwind utilities / small component classes.

### Theme / dark mode
- `ThemeProvider` (React context) + `useTheme()` hook: resolves `localStorage` → `prefers-color-scheme`, toggles `.dark` on `<html>`, persists choice.
- **No-flash inline script** in `index.html` `<head>` sets the class before React hydrates.
- Toggle button in the navbar (sun/moon icon from `react-icons`).
- All colors respect the token pair (light/dark) so the whole site themes from one place.

### Component structure
Replace the `AppWrap`/`MotionWrap` HOCs with composable pieces under `src/components/` and `src/sections/`:

- `components/Navbar.jsx` — sticky top bar: logo, section anchor links, "Resume" button, theme toggle; mobile hamburger menu.
- `components/Section.jsx` — layout primitive: `max-w` container, consistent vertical padding, `id` anchor, optional heading.
- `components/Reveal.jsx` — thin `motion` wrapper (scroll-in fade/slide) replacing `MotionWrap`; respects `prefers-reduced-motion`.
- `components/ThemeToggle.jsx`, `context/ThemeProvider.jsx`.
- `lib/sanity.js` — `@sanity/client` + `@sanity/image-url`, reads `VITE_SANITY_PROJECT_ID`/`dataset`, `useCdn: true`, **no token** (public content).
- `sections/Hero.jsx`, `About.jsx`, `Experience.jsx`, `Projects.jsx`, `Skills.jsx`, `Education.jsx`, `Contact.jsx`.
- `App.jsx` composes: `<Navbar/>` + each section in the resume order + `<Footer/>`.

### Sections & data sources
| Section | Content source |
|---|---|
| Hero | Sanity `profile` singleton (name, title, tagline, resume PDF, socials) |
| About | Sanity `abouts` |
| Experience | Sanity `experience` (resume-grade) |
| Projects | Sanity `works` |
| Skills | Sanity `skills` (grouped by `category`) |
| Education | Sanity `education` (new) |
| Contact | Netlify Forms (POST); social links from `profile` |

---

## Design system — "Editorial slate"

### Palette (defined as CSS tokens, light / dark)
- Background: `#fafafa` / `#0b1120`
- Surface (cards): `#ffffff` / `#111a2e`
- Text primary: `#0f172a` / `#e2e8f0`
- Text muted: `slate-500` / `slate-400`
- Accent: `#2563eb` (blue-600), hover `#1d4ed8`; dark accent `#3b82f6`
- Border/hairline: `slate-200` / `slate-800`

### Typography
- **Inter** self-hosted via `@fontsource-variable/inter` (no CDN → Netlify + CSP friendly).
- Headings: Inter, tight tracking, large/bold, confident scale.
- Body: Inter, comfortable line-height.
- Optional mono (`@fontsource/jetbrains-mono`) for dates/labels for an editorial touch.

### Layout & motion
- Content max-width ~1080px, generous whitespace, consistent section rhythm.
- Cards with thin borders (not heavy shadows) to match the editorial feel.
- Subtle scroll-reveal via `motion`; reduced-motion honored. No parallax/heavy effects.

---

## Sanity backend (v3 migration + content model)

### Studio migration (v2 → v3)
- New `sanity.config.ts` (replaces `sanity.json`), `structureTool` + `visionTool`.
- Update `@sanity/*` deps to v3; schemas rewritten with `defineType`/`defineField`.
- Run with `sanity dev` (CLI) instead of `sanity start`. Node 18+.
- Keep same `projectId` (`0bxjr1em`) / dataset (`production`).

### Content model (v3)
Field naming **normalized** to a single convention (`imageUrl`) across all types — fixes the `imgurl` vs `imgUrl` inconsistency.

**New — `profile` (singleton):** `name`, `title`, `tagline`, `bio`, `email`, `resumePdf` (file), `socials[]` (`{platform, url}`), `avatar` (image).

**Reworked — `experience`:** `role`, `company`, `companyUrl`, `location`, `startDate` (date), `endDate` (date, nullable), `current` (bool), `highlights[]` (array of strings), `logo` (image). Replaces the old `experiences{year}` + nested `workExperience`.

**New — `education`:** `school`, `degree`, `field`, `location`, `startDate`, `endDate`, `description`, `logo`.

**Updated — `skills`:** add `category` (Frontend / Backend / Tools / Other) for grouping; keep `name`, `icon`, `bgColor`.

**Kept — `works`:** `title`, `description`, `projectLink`, `codeLink`, `imageUrl` (renamed), `tags[]`.

**Kept — `abouts`:** `title`, `description`, `imageUrl` (renamed).

**Removed:** `testimonials`, `brands`, `experiences`, `workExperience`, and (if Netlify Forms adopted) `contact`.

### Content note
The user will repopulate/adjust content in the new Studio after the schema is in place. Existing documents of removed/renamed types will need manual cleanup or a light migration in the Studio.

---

## Deployment (Netlify)
- `netlify.toml`: `[build] command = "vite build"`, `publish = "dist"`; `[[redirects]] from="/*" to="/index.html" status=200` for SPA routing.
- Netlify UI env vars: `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET` (no secret token needed for public reads).
- Netlify Forms: a hidden static form for detection + the React form posting `application/x-www-form-urlencoded`; enable email notifications in Netlify.

---

## Dependency changes

**Remove:** `react-scripts`, `node-sass`, `three`, `three-orbitcontrols`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `lil-gui`, `web-vitals`, CRA testing libs (unless we add Vitest), `react-tooltip` (replace with CSS/title or keep if still wanted).

**Add:** `vite`, `@vitejs/plugin-react`, `tailwindcss`@4, `@tailwindcss/vite`, `@fontsource-variable/inter`, (optional) `@fontsource/jetbrains-mono`.

**Update:** `react`/`react-dom` (latest 18/19 — pin after compat check), `framer-motion` → `motion` (latest), `@sanity/client`, `@sanity/image-url`, `react-icons`.

---

## Execution phases (detailed plan comes from writing-plans)
1. **Vite migration** — get the existing app building/running on Vite (no visual change yet), env vars, delete CRA.
2. **Remove 3D + dead deps** — delete `threeJS/`, drop three/gsap/lil-gui, remove from `App`.
3. **Tailwind v4 + design tokens + theme** — install, tokens, ThemeProvider, no-flash script, delete SCSS.
4. **Rebuild sections** — Navbar, Section/Reveal primitives, then each section in the new design against current Sanity shapes (temporary), Editorial-slate styling, responsive + dark.
5. **Sanity v3 migration** — Studio to v3, rewrite schemas, add `profile`/`experience`/`education`, remove dead types, normalize field names; point sections at the new shapes.
6. **Contact via Netlify Forms** + `netlify.toml` + deploy config.
7. **Docs update** — root `CLAUDE.md`, `backend_sanity/CLAUDE.md`, `README.md`.

## Risks & mitigations
- **React 19 compat** with `motion`/`react-icons` → verify; fall back to React 18 if needed.
- **Sanity v3 migration** is the riskiest track (breaking API, config format) → do it as an isolated phase after the frontend is stable on the old shapes; keep `projectId`/dataset identical.
- **Renaming schema fields** breaks existing documents → normalize deliberately; document that existing content needs re-entry (user is refilling content anyway).
- **Contact form change** → if user prefers Sanity storage, keep `contact` type + a serverless Netlify Function holding the write token instead of bundling it client-side.

## Verification
- App builds (`vite build`) and runs (`vite dev`); no console errors.
- Dark/light toggle works, persists, no flash; both themes visually checked on the running app (referenced against the live site `christian-bermeo.netlify.app`).
- Responsive at mobile/tablet/desktop widths.
- Each section renders with placeholder/real Sanity data.
- Sanity Studio v3 runs (`sanity dev`) and shows the new schemas.
