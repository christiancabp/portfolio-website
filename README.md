# Christian Bermeo — Portfolio

Personal portfolio site: a single-page React app (Hero, About, Experience, Projects, Skills, Education, Contact) with content pulled from a Sanity CMS, light/dark theming, and a Netlify Forms contact form. Deployed at [cbermeo.com](https://cbermeo.com).

## Stack

- **Build:** [Vite 7](https://vite.dev/) + `@vitejs/plugin-react` (React 18)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`, CSS-first design tokens in `src/index.css` (no SCSS, no CSS-in-JS)
- **Dark mode:** class-based (`.dark` on `<html>`), persisted to `localStorage`, respects `prefers-color-scheme`, no-flash inline script in `index.html`
- **Animation:** [`motion`](https://motion.dev/) (the successor to Framer Motion)
- **Content:** [Sanity](https://www.sanity.io/) (`@sanity/client`) via GROQ queries, with dev-only fixture fallbacks
- **Contact form:** Netlify Forms (no backend/API route)
- **Testing:** [Vitest](https://vitest.dev/) + Testing Library (jsdom)
- **Hosting:** Netlify, custom domain `cbermeo.com`

## Commands

```bash
npm install          # install dependencies
npm run dev           # start the Vite dev server (http://localhost:5173)
npm run build         # production build to dist/
npm run preview       # preview the production build locally
npm test              # run the Vitest suite once
npm run test:watch    # run Vitest in watch mode
```

Requires Node 18+ (Vite 7's minimum). Netlify's own build is pinned to Node 20 via `netlify.toml`.

## Environment variables

The Sanity project ID (`0bxjr1em`) and dataset (`production`) are defaulted in `src/lib/sanity.js`, so **no env vars are strictly required** to run the app. Set these only to point at a different Sanity project/dataset (e.g. local testing against a separate dataset):

```bash
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
```

See `.env.example`. These are public, client-side values (Sanity's `projectId`/`dataset` are not secrets) — there is no Sanity write token in the frontend.

## How content works

Sections fetch their data from Sanity at runtime via `src/hooks/useSanity.js` (raw `client.fetch` + GROQ query, see `src/lib/queries.js`) wrapped by `src/hooks/useContent.js`. `useContent(query, fixture)` returns the live Sanity result, but **in dev only** (`import.meta.env.DEV`) falls back to a static fixture from `src/lib/fixtures.js` if Sanity returns empty/null — so the site is fully browsable locally even against an empty or misconfigured dataset. **Production builds never use fixtures**; if Sanity has no data, the section renders empty.

Images referenced from Sanity documents are resolved with `imageUrl()` / `urlFor()` in `src/lib/sanity.js` (`@sanity/image-url`).

## Sanity Studio (content admin)

The content schemas and admin UI live in `backend_sanity/`, a **separate project with its own `package.json` and npm** (not yarn):

```bash
cd backend_sanity
npm install
npx sanity login   # one-time browser auth
npm run dev         # studio at http://localhost:3333
npm run build
npm run deploy
```

This is the current Sanity Studio (`sanity@^6.15.0`, `sanity.config.ts`, `defineType` schemas under `schemaTypes/`), with a content model that matches what the frontend queries (profile, experience, education, work, about, skill — see `src/lib/queries.js` and `src/lib/fixtures.js`). No API token is involved: the Studio authenticates via `sanity login`, and the live site reads the `production` dataset anonymously (public dataset + CORS origins, see below). See `backend_sanity/CLAUDE.md` for the full content-model reference.

## Deploy (Netlify)

Configured via `netlify.toml`: build command `npm run build`, publish directory `dist`, SPA fallback redirect (`/*` → `/index.html`), Node 20. Custom domain: **cbermeo.com**.

For live content and form delivery to work on a fresh Netlify site, set up in the Netlify dashboard:

- **Sanity dataset visibility:** set the `production` dataset to **public** in [sanity.io/manage](https://www.sanity.io/manage) (the frontend reads with no auth token).
- **Sanity CORS origins:** add these origins under the Sanity project's API settings:
  - `https://cbermeo.com`
  - `https://www.cbermeo.com`
  - the site's `*.netlify.app` URL
  - `http://localhost:5173` (local dev)
- **Netlify Forms notifications:** point the `contact` form's notification to `hello@cbermeo.com` (Site settings → Forms → Form notifications).

The contact form itself needs no server code — it's a static Netlify Forms submission (see `src/sections/Contact.jsx`, `src/lib/netlify.js`, and the hidden detection form in `index.html`).
