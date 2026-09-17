# Portfolio Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Visual section tasks should be implemented with the `frontend-design` skill.

**Goal:** Modernize a CRA/SCSS/Three.js portfolio into a fast, resume-oriented single-page site on Vite + Tailwind v4 with dark mode, backed by an upgraded Sanity v3 content model.

**Architecture:** Vite + React 19 SPA. Tailwind v4 (CSS-first tokens) with a class-based dark mode driven by a `ThemeProvider` (localStorage + `prefers-color-scheme`, no-flash inline script). Content comes from Sanity (public CDN reads, no token); the contact form posts to Netlify Forms. The Sanity Studio (`backend_sanity/`) is migrated from v2 to v3 with a reworked, resume-grade schema. Deployed on Netlify (`dist/` + SPA redirect).

**Tech Stack:** Vite, React 19, Tailwind CSS v4, `motion`, `@sanity/client` v6, `@fontsource-variable/inter`, Vitest + React Testing Library, Sanity Studio v3, Netlify.

**Visual identity ("Editorial slate"):** near-monochrome slate/zinc, `#2563eb` accent (dark `#3b82f6`), Inter, minimal/timeless, thin-border cards, generous whitespace, subtle scroll reveals.

---

## File structure (target)

Frontend (`/src`):
- `main.jsx` — entry (renamed from `index.js`)
- `App.jsx` — composes Navbar + sections + Footer
- `index.css` — Tailwind import + theme tokens + dark variant
- `lib/sanity.js` — Sanity client + `urlFor`
- `lib/queries.js` — GROQ query strings
- `lib/theme.js` — pure `resolveInitialTheme(stored, prefersDark)`
- `lib/netlify.js` — pure `encode(formData)`
- `lib/glitch.js` — pure `nextIndex(i, len)` (hero role rotation)
- `context/ThemeProvider.jsx` — theme context + `useTheme`
- `components/Navbar.jsx`, `components/Section.jsx`, `components/Reveal.jsx`, `components/ThemeToggle.jsx`, `components/GlitchText.jsx`, `components/Footer.jsx`
- `sections/Hero.jsx`, `About.jsx`, `Experience.jsx`, `Projects.jsx`, `Skills.jsx`, `Education.jsx`, `Contact.jsx`
- `hooks/useSanity.js` — small fetch hook (loading/data/error)
- Deleted: `App.scss`, all `*.scss`, `wrapper/`, `components/threeJS/`, `client.js`, `constants/` (folded into components as needed)

Root:
- `vite.config.js`, `index.html` (moved from `public/`), `netlify.toml`, `vitest.config.js`, `.env.example`

Backend (`/backend_sanity`):
- `sanity.config.ts`, `sanity.cli.ts`, `schemaTypes/index.ts` + one file per type
- Deleted: `sanity.json`, `schemas/` (old part-based)

---

## PHASE 1 — Vite migration (app builds on Vite, no visual change)

### Task 1.1: Install Vite toolchain and rewrite package.json scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Remove CRA, add Vite**

Run:
```bash
npm uninstall react-scripts web-vitals
npm install -D vite @vitejs/plugin-react
```

- [ ] **Step 2: Replace scripts and clean eslintConfig/browserslist in `package.json`**

Set the `scripts` block to:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```
Remove the CRA `eslintConfig` and `browserslist` keys (Vite/esbuild don't use them).

- [ ] **Step 3: Commit**
```bash
git add package.json package-lock.json
git commit -m "build: replace react-scripts with vite"
```

### Task 1.2: Move index.html to root and wire Vite entry

**Files:**
- Create: `index.html` (root)
- Create: `vite.config.js`
- Rename: `src/index.js` → `src/main.jsx`
- Delete: `public/index.html`

- [ ] **Step 1: Create `vite.config.js`**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 2: Create root `index.html`** (Vite serves from root; scripts load as ES modules)
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/chris-logo2.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Christian Bermeo — Software Developer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Rename entry and fix ReactDOM import**
```bash
git mv src/index.js src/main.jsx
git rm public/index.html
```
Ensure `src/main.jsx` contains:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```
(Note: `App.js` imports `./App.scss` and the Three.js scenes — those still exist at this phase; they are removed in Phase 2. StrictMode is safe to re-enable now that the imperative Three.js code is being deleted.)

- [ ] **Step 4: Create a temporary `src/index.css`** so the import resolves (Tailwind added in Phase 3):
```css
/* temporary — replaced in Phase 3 */
```

- [ ] **Step 5: Verify dev server boots**

Run: `npm run dev`
Expected: Vite prints a `localhost:5173` URL and the app loads without a build error. (Sanity-driven sections may be empty — env not migrated yet; that's fine.) Stop the server with Ctrl-C.

- [ ] **Step 6: Commit**
```bash
git add -A
git commit -m "build: move to vite entry (index.html + main.jsx)"
```

### Task 1.3: Migrate env vars to VITE_ prefix

**Files:**
- Modify: `src/client.js`
- Create: `.env.example`
- Modify: local `.env` (not committed)

- [ ] **Step 1: Update `.env` (local) and create `.env.example`**

Local `.env` (kept out of git):
```
VITE_SANITY_PROJECT_ID=0bxjr1em
VITE_SANITY_DATASET=production
```
`.env.example` (committed):
```
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
```

- [ ] **Step 2: Update `src/client.js` to Vite env + tokenless reads**
```js
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)
```
(The `token` is intentionally removed — public dataset reads via CDN need none. This is moved to `src/lib/sanity.js` in Phase 7.)

- [ ] **Step 3: Update `@sanity/client`**

Run:
```bash
npm install @sanity/client@latest @sanity/image-url@latest
```

- [ ] **Step 4: Verify**

Run: `npm run dev`
Expected: no import errors; if the Sanity dataset is public, `works` renders. Ctrl-C.

- [ ] **Step 5: Commit**
```bash
git add src/client.js .env.example package.json package-lock.json
git commit -m "build: migrate sanity client to VITE_ env, tokenless reads"
```

---

## PHASE 2 — Remove 3D scenes and dead dependencies

### Task 2.1: Delete Three.js scenes and their usage

**Files:**
- Delete: `src/components/threeJS/` (ThreeScene.js, ThreeProducts.js, ThreeProduct.css)
- Modify: `src/App.js`

- [ ] **Step 1: Remove imports and JSX from `src/App.js`**

Delete the two `import ... threeJS/...` lines and the `<div><ThreeScene/></div>` + `<div><ThreeProducts/></div>` blocks. Resulting `App.js` renders: `Navbar, Header, About, Work, Skills, Testimonial, Footer` (further changed in later phases).

- [ ] **Step 2: Delete the directory**
```bash
git rm -r src/components/threeJS
```

- [ ] **Step 3: Uninstall 3D + animation-only-for-3D deps**
```bash
npm uninstall three three-orbitcontrols @react-three/fiber @react-three/drei gsap lil-gui
```

- [ ] **Step 4: Verify**

Run: `npm run dev`
Expected: app loads, no 3D sections, no console import errors. Ctrl-C.

- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "feat: remove 3D scenes and unused deps"
```

---

## PHASE 3 — Tailwind v4, design tokens, fonts

### Task 3.1: Install and wire Tailwind v4

**Files:**
- Modify: `vite.config.js`
- Rewrite: `src/index.css`
- Modify: `src/main.jsx` (font import)

- [ ] **Step 1: Install**
```bash
npm install tailwindcss @tailwindcss/vite
npm install @fontsource-variable/inter
```

- [ ] **Step 2: Add the Tailwind plugin to `vite.config.js`**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 3: Write `src/index.css` with tokens + dark variant**
```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --bg: #fafafa;
  --surface: #ffffff;
  --text: #0f172a;
  --muted: #64748b;
  --accent: #2563eb;
  --accent-hover: #1d4ed8;
  --border: #e2e8f0;
}

.dark {
  --bg: #0b1120;
  --surface: #111a2e;
  --text: #e2e8f0;
  --muted: #94a3b8;
  --accent: #3b82f6;
  --accent-hover: #60a5fa;
  --border: #1e293b;
}

/* Expose CSS vars as Tailwind color/font utilities (bg-bg, text-text, etc.).
   `inline` means utilities read the live var, so .dark flips them. */
@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-text: var(--text);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-border: var(--border);
  --font-sans: "InterVariable", ui-sans-serif, system-ui, sans-serif;
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}
```

- [ ] **Step 4: Import the font in `src/main.jsx`** (add near the top, after React imports)
```jsx
import '@fontsource-variable/inter'
```

- [ ] **Step 5: Verify utilities compile**

Temporarily add `className="bg-bg text-text p-8"` to the root `div` in `App.js`, run `npm run dev`, confirm the background/text colors apply and Inter loads. Remove the temporary class after confirming. Ctrl-C.

- [ ] **Step 6: Commit**
```bash
git add -A
git commit -m "feat: add tailwind v4 with editorial-slate tokens and inter font"
```

### Task 3.2: Add Vitest for logic unit tests

**Files:**
- Create: `vitest.config.js`
- Create: `src/test/setup.js`
- Modify: `package.json` (dev deps only)

- [ ] **Step 1: Install**
```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```
(These replace the removed CRA testing libs; keep only what Vitest needs.)

- [ ] **Step 2: Create `vitest.config.js`**
```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
})
```

- [ ] **Step 3: Create `src/test/setup.js`**
```js
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Verify runner works (no tests yet is an error, so add a trivial one)**

Create `src/test/smoke.test.js`:
```js
import { describe, it, expect } from 'vitest'
describe('vitest', () => { it('runs', () => { expect(1 + 1).toBe(2) }) })
```
Run: `npm test`
Expected: 1 passing test.

- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "test: add vitest + testing-library setup"
```

---

## PHASE 4 — Dark mode theme system

### Task 4.1: Pure theme resolver (TDD)

**Files:**
- Create: `src/lib/theme.js`
- Test: `src/lib/theme.test.js`

- [ ] **Step 1: Write the failing test**
```js
import { describe, it, expect } from 'vitest'
import { resolveInitialTheme } from './theme'

describe('resolveInitialTheme', () => {
  it('prefers a stored dark choice', () => {
    expect(resolveInitialTheme('dark', false)).toBe('dark')
  })
  it('prefers a stored light choice even if OS is dark', () => {
    expect(resolveInitialTheme('light', true)).toBe('light')
  })
  it('falls back to OS dark when nothing stored', () => {
    expect(resolveInitialTheme(null, true)).toBe('dark')
  })
  it('falls back to light when nothing stored and OS light', () => {
    expect(resolveInitialTheme(null, false)).toBe('light')
  })
  it('ignores invalid stored values', () => {
    expect(resolveInitialTheme('purple', true)).toBe('dark')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- theme`
Expected: FAIL ("resolveInitialTheme is not a function" / import error).

- [ ] **Step 3: Implement `src/lib/theme.js`**
```js
export function resolveInitialTheme(stored, prefersDark) {
  if (stored === 'dark' || stored === 'light') return stored
  return prefersDark ? 'dark' : 'light'
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- theme`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**
```bash
git add src/lib/theme.js src/lib/theme.test.js
git commit -m "feat: add theme resolver with tests"
```

### Task 4.2: ThemeProvider + no-flash script

**Files:**
- Create: `src/context/ThemeProvider.jsx`
- Modify: `index.html` (inline no-flash script)
- Modify: `src/main.jsx` (wrap App)

- [ ] **Step 1: Add the no-flash script to `<head>` in `index.html`** (before the module script)
```html
<script>
  (function () {
    try {
      var s = localStorage.getItem('theme');
      var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (s === 'dark' || (s !== 'light' && d)) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
</script>
```

- [ ] **Step 2: Create `src/context/ThemeProvider.jsx`**
```jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { resolveInitialTheme } from '../lib/theme'

const ThemeContext = createContext({ theme: 'light', toggle: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    resolveInitialTheme(
      localStorage.getItem('theme'),
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
```

- [ ] **Step 3: Wrap `<App/>` in `src/main.jsx`**
```jsx
import { ThemeProvider } from './context/ThemeProvider'
// ...
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
```

- [ ] **Step 4: Commit**
```bash
git add -A
git commit -m "feat: add ThemeProvider and no-flash theme script"
```

### Task 4.3: ThemeToggle component

**Files:**
- Create: `src/components/ThemeToggle.jsx`

- [ ] **Step 1: Implement**
```jsx
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../context/ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="rounded-md border border-border p-2 text-muted transition-colors hover:text-accent"
    >
      {theme === 'dark' ? <FiSun /> : <FiMoon />}
    </button>
  )
}
```

- [ ] **Step 2: Update `react-icons`**
```bash
npm install react-icons@latest
```

- [ ] **Step 3: Temporarily mount `<ThemeToggle/>` at the top of `App.js` and verify**

Run: `npm run dev`, click the toggle, confirm the whole page flips light↔dark, reload confirms persistence, and there is no flash on reload. Ctrl-C. (The toggle moves into the Navbar in Phase 6.)

- [ ] **Step 4: Commit**
```bash
git add -A
git commit -m "feat: add theme toggle"
```

---

## PHASE 5 — Sanity Studio v3 migration + content model (`backend_sanity/`)

> This phase is isolated: it only touches `backend_sanity/`. Do it before rebuilding sections (Phase 8) so sections target the final shapes. All commands run from `backend_sanity/`.

### Task 5.1: Replace v2 config with v3

**Files:**
- Delete: `backend_sanity/sanity.json`, `backend_sanity/schemas/`
- Create: `backend_sanity/sanity.config.ts`, `backend_sanity/sanity.cli.ts`, `backend_sanity/package.json` (rewritten), `backend_sanity/schemaTypes/index.ts`

- [ ] **Step 1: Reset dependencies to Sanity v3**

From `backend_sanity/`:
```bash
rm -rf node_modules yarn.lock package-lock.json
```
Rewrite `backend_sanity/package.json`:
```json
{
  "name": "chris-portfolio-studio",
  "version": "3.0.0",
  "private": true,
  "scripts": {
    "dev": "sanity dev",
    "build": "sanity build",
    "deploy": "sanity deploy"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sanity": "^3",
    "@sanity/vision": "^3",
    "styled-components": "^6"
  }
}
```
Then:
```bash
npm install
```

- [ ] **Step 2: Create `backend_sanity/sanity.cli.ts`**
```ts
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {projectId: '0bxjr1em', dataset: 'production'},
})
```

- [ ] **Step 3: Create `backend_sanity/sanity.config.ts`**
```ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'chris-portfolio-website',
  projectId: '0bxjr1em',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {types: schemaTypes},
})
```

- [ ] **Step 4: Delete old v2 files**
```bash
git rm backend_sanity/sanity.json
git rm -r backend_sanity/schemas
```

- [ ] **Step 5: Commit** (schemaTypes created next task; app won't run until then)
```bash
git add -A
git commit -m "chore(sanity): scaffold studio v3 config"
```

### Task 5.2: Write the v3 schema types

**Files:**
- Create: `backend_sanity/schemaTypes/index.ts` and one file per type below.

Naming convention: all image fields are named `image` or a descriptive name (`logo`, `avatar`); the old `imgUrl`/`imgurl` split is gone.

- [ ] **Step 1: `schemaTypes/profile.ts`** (singleton)
```ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'title', title: 'Job title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'tagline', type: 'string'}),
    defineField({name: 'bio', type: 'text', rows: 4}),
    defineField({name: 'email', type: 'string'}),
    defineField({name: 'avatar', type: 'image', options: {hotspot: true}}),
    defineField({name: 'resumePdf', title: 'Resume PDF', type: 'file'}),
    defineField({
      name: 'socials',
      type: 'array',
      of: [
        defineField({
          name: 'social',
          type: 'object',
          fields: [
            {name: 'platform', type: 'string'},
            {name: 'url', type: 'url'},
          ],
        }),
      ],
    }),
  ],
})
```

- [ ] **Step 2: `schemaTypes/experience.ts`**
```ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({name: 'role', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'company', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'companyUrl', type: 'url'}),
    defineField({name: 'location', type: 'string'}),
    defineField({name: 'startDate', type: 'date', validation: (r) => r.required()}),
    defineField({name: 'endDate', type: 'date'}),
    defineField({name: 'current', title: 'Currently here', type: 'boolean', initialValue: false}),
    defineField({name: 'highlights', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'logo', type: 'image', options: {hotspot: true}}),
  ],
  orderings: [
    {title: 'Start date (newest)', name: 'startDesc', by: [{field: 'startDate', direction: 'desc'}]},
  ],
  preview: {select: {title: 'role', subtitle: 'company'}},
})
```

- [ ] **Step 3: `schemaTypes/education.ts`**
```ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    defineField({name: 'school', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'degree', type: 'string'}),
    defineField({name: 'field', title: 'Field of study', type: 'string'}),
    defineField({name: 'location', type: 'string'}),
    defineField({name: 'startDate', type: 'date'}),
    defineField({name: 'endDate', type: 'date'}),
    defineField({name: 'description', type: 'text', rows: 3}),
    defineField({name: 'logo', type: 'image', options: {hotspot: true}}),
  ],
  orderings: [
    {title: 'End date (newest)', name: 'endDesc', by: [{field: 'endDate', direction: 'desc'}]},
  ],
  preview: {select: {title: 'school', subtitle: 'degree'}},
})
```

- [ ] **Step 4: `schemaTypes/work.ts`** (projects; renamed image field)
```ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'work',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'description', type: 'text', rows: 3}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'projectLink', title: 'Live link', type: 'url'}),
    defineField({name: 'codeLink', title: 'Code link', type: 'url'}),
    defineField({name: 'tags', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}}),
  ],
  preview: {select: {title: 'title', media: 'image'}},
})
```

- [ ] **Step 5: `schemaTypes/about.ts`**
```ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'about',
  title: 'About item',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'description', type: 'text', rows: 3}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
  ],
})
```

- [ ] **Step 6: `schemaTypes/skill.ts`** (adds category)
```ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'category',
      type: 'string',
      options: {list: ['Frontend', 'Backend', 'Tools', 'Other']},
      initialValue: 'Other',
    }),
    defineField({name: 'icon', type: 'image', options: {hotspot: true}}),
    defineField({name: 'bgColor', title: 'Background color', type: 'string'}),
  ],
  preview: {select: {title: 'name', subtitle: 'category', media: 'icon'}},
})
```

- [ ] **Step 7: `schemaTypes/index.ts`**
```ts
import profile from './profile'
import experience from './experience'
import education from './education'
import work from './work'
import about from './about'
import skill from './skill'

export const schemaTypes = [profile, experience, education, work, about, skill]
```

- [ ] **Step 8: Verify the Studio runs**

From `backend_sanity/`: `npm run dev`
Expected: Studio opens at `localhost:3333`, shows document types Profile, Experience, Education, Project, About item, Skill — and no `testimonials`/`brands`. Ctrl-C.

- [ ] **Step 9: Commit**
```bash
git add -A
git commit -m "feat(sanity): resume-grade v3 schema (profile/experience/education, normalized fields)"
```

### Task 5.3: Make `profile` a true singleton in the desk structure

**Files:**
- Modify: `backend_sanity/sanity.config.ts`

- [ ] **Step 1: Add a custom structure so Profile is a single editable doc**
```ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'chris-portfolio-website',
  projectId: '0bxjr1em',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Profile')
              .child(S.document().schemaType('profile').documentId('profile')),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (li) => li.getId() !== 'profile'
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {types: schemaTypes},
})
```

- [ ] **Step 2: Verify** — `npm run dev`, confirm "Profile" opens a single document editor. Ctrl-C.

- [ ] **Step 3: Commit**
```bash
git add backend_sanity/sanity.config.ts
git commit -m "feat(sanity): profile singleton in desk structure"
```

---

## PHASE 6 — Layout shell (Navbar, Section, Reveal, Footer)

### Task 6.1: Section and Reveal primitives

**Files:**
- Create: `src/components/Section.jsx`, `src/components/Reveal.jsx`
- Modify: `package.json` (motion)

- [ ] **Step 1: Install motion**
```bash
npm uninstall framer-motion
npm install motion
```

- [ ] **Step 2: `src/components/Section.jsx`**
```jsx
export default function Section({ id, title, eyebrow, children, className = '' }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-5xl px-6 py-20 md:py-28 ${className}`}>
      {(title || eyebrow) && (
        <header className="mb-10">
          {eyebrow && <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">{eyebrow}</p>}
          {title && <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>}
        </header>
      )}
      {children}
    </section>
  )
}
```

- [ ] **Step 3: `src/components/Reveal.jsx`**
```jsx
import { motion } from 'motion/react'

export default function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 4: Commit**
```bash
git add -A
git commit -m "feat: add Section and Reveal layout primitives"
```

### Task 6.2: Navbar with anchor links + toggle

**Files:**
- Create: `src/components/Navbar.jsx`
- Delete: `src/wrapper/`, `src/components/NavigationDots.jsx`, `src/components/SocialMedia.jsx`, old `src/components/Navbar/` (replaced)

- [ ] **Step 1: Implement `src/components/Navbar.jsx`**

Requirements (build markup with `frontend-design` skill):
- Sticky top (`sticky top-0 z-50`), translucent `bg-bg/80` + `backdrop-blur`, thin bottom `border-border`.
- Left: logo/initials linking to `#hero`.
- Center/right (desktop `md:flex`, hidden on mobile): anchor links to `#about #experience #projects #skills #education #contact`, a "Resume" link (opens `profile.resumePdf` in new tab), and `<ThemeToggle/>`.
- Mobile: hamburger toggles a full-width dropdown menu of the same links; closes on link click.
- Links use `text-muted hover:text-text` transitions; smooth scroll via `html { scroll-behavior: smooth }` (add to `index.css`) and `scroll-mt-20` on sections (add to `Section`).

- [ ] **Step 2: Delete obsolete chrome**
```bash
git rm -r src/wrapper src/components/NavigationDots.jsx src/components/SocialMedia.jsx
git rm -r "src/components/Navbar/Navbar.scss"
```
(Keep/replace `src/components/Navbar/Navbar.jsx` content with the new component, or move to `src/components/Navbar.jsx` and delete the folder — pick one path and update imports.)

- [ ] **Step 3: Add smooth-scroll + scroll-margin**

In `index.css` add `html { scroll-behavior: smooth; }` and add `scroll-mt-20` to the `<section>` className in `Section.jsx`.

- [ ] **Step 4: Verify** — `npm run dev`; nav is sticky, links scroll to sections, toggle works, mobile menu opens/closes. Ctrl-C.

- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "feat: add sticky navbar, remove legacy HOC chrome"
```

### Task 6.3: Data-fetch hook + queries

**Files:**
- Create: `src/lib/sanity.js` (move from `src/client.js`), `src/lib/queries.js`, `src/hooks/useSanity.js`
- Delete: `src/client.js`

- [ ] **Step 1: Move client to `src/lib/sanity.js`** (same content as the Phase-1 `client.js`), then `git rm src/client.js` and update all imports to `../lib/sanity`.

- [ ] **Step 2: `src/lib/queries.js`**
```js
export const PROFILE = `*[_type == "profile"][0]`
export const ABOUTS = `*[_type == "about"]`
export const EXPERIENCES = `*[_type == "experience"] | order(startDate desc)`
export const PROJECTS = `*[_type == "work"] | order(_createdAt desc)`
export const SKILLS = `*[_type == "skill"]`
export const EDUCATION = `*[_type == "education"] | order(endDate desc)`
```

- [ ] **Step 3: `src/hooks/useSanity.js`**
```js
import { useEffect, useState } from 'react'
import { client } from '../lib/sanity'

export function useSanity(query, params = {}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    client
      .fetch(query, params)
      .then((res) => { if (active) { setData(res); setError(null) } })
      .catch((e) => { if (active) setError(e) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [query, JSON.stringify(params)])

  return { data, error, loading }
}
```

- [ ] **Step 4: Commit**
```bash
git add -A
git commit -m "feat: add sanity lib, queries, and useSanity hook"
```

---

## PHASE 7 — Data adapters (TDD for the logic-bearing bits)

### Task 7.1: Skills grouping + experience date formatting

**Files:**
- Create: `src/lib/format.js`
- Test: `src/lib/format.test.js`

- [ ] **Step 1: Write failing tests**
```js
import { describe, it, expect } from 'vitest'
import { groupByCategory, formatDateRange } from './format'

describe('groupByCategory', () => {
  it('groups skills by category preserving order', () => {
    const skills = [
      { name: 'React', category: 'Frontend' },
      { name: 'Node', category: 'Backend' },
      { name: 'CSS', category: 'Frontend' },
    ]
    expect(groupByCategory(skills)).toEqual({
      Frontend: [{ name: 'React', category: 'Frontend' }, { name: 'CSS', category: 'Frontend' }],
      Backend: [{ name: 'Node', category: 'Backend' }],
    })
  })
  it('buckets missing category under Other', () => {
    expect(groupByCategory([{ name: 'x' }])).toEqual({ Other: [{ name: 'x' }] })
  })
})

describe('formatDateRange', () => {
  it('formats a closed range', () => {
    expect(formatDateRange('2021-06-01', '2023-02-01', false)).toBe('Jun 2021 — Feb 2023')
  })
  it('shows Present when current', () => {
    expect(formatDateRange('2023-03-01', null, true)).toBe('Mar 2023 — Present')
  })
})
```

- [ ] **Step 2: Run to verify fail**

Run: `npm test -- format`
Expected: FAIL (functions not defined).

- [ ] **Step 3: Implement `src/lib/format.js`**
```js
export function groupByCategory(skills) {
  return skills.reduce((acc, s) => {
    const key = s.category || 'Other'
    ;(acc[key] ||= []).push(s)
    return acc
  }, {})
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function label(iso) {
  const [y, m] = iso.split('-')
  return `${MONTHS[Number(m) - 1]} ${y}`
}

export function formatDateRange(start, end, current) {
  const right = current || !end ? 'Present' : label(end)
  return `${label(start)} — ${right}`
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- format`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**
```bash
git add src/lib/format.js src/lib/format.test.js
git commit -m "feat: add skills grouping and date-range formatting with tests"
```

---

## PHASE 8 — Rebuild sections (Editorial slate, dark-mode-ready)

> Build each section's markup with the `frontend-design` skill. Shared requirements for every section: wrap content in `<Section>`, animate blocks with `<Reveal>`, use only token utilities (`bg-bg/surface/accent`, `text-text/muted`, `border-border`) so dark mode works automatically, be responsive (mobile-first), and handle empty/loading data gracefully (render nothing or a skeleton, never crash on `undefined`).

### Task 8.1: Hero + glitchy landing animation

**Files:** Create `src/lib/glitch.js`, `src/lib/glitch.test.js`, `src/components/GlitchText.jsx`, `src/sections/Hero.jsx`; delete `src/container/Header/`.

The landing headline reads **"Hey I'm Christian, your friendly neighborhood {role}"**, where `{role}` glitch-scrambles on a loop between: `developer, student, dad, ai-enthusiast, freelancer, future-millionaire`.

- [ ] **Step 1: Write the failing test for the role-rotation helper** (`src/lib/glitch.test.js`)
```js
import { describe, it, expect } from 'vitest'
import { nextIndex } from './glitch'

describe('nextIndex', () => {
  it('advances to the next role', () => expect(nextIndex(0, 6)).toBe(1))
  it('wraps around at the end', () => expect(nextIndex(5, 6)).toBe(0))
})
```

- [ ] **Step 2: Run to verify fail**

Run: `npm test -- glitch`
Expected: FAIL (`nextIndex` not defined).

- [ ] **Step 3: Implement `src/lib/glitch.js`**
```js
export function nextIndex(i, len) {
  return (i + 1) % len
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- glitch`
Expected: PASS (2 tests).

- [ ] **Step 5: Create `src/components/GlitchText.jsx`** (text-scramble effect, reduced-motion aware)
```jsx
import { useEffect, useRef, useState } from 'react'
import { nextIndex } from '../lib/glitch'

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#'

export default function GlitchText({ words, interval = 2400, className = '' }) {
  const [html, setHtml] = useState(words[0])
  const idx = useRef(0)
  const raf = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let current = words[0]
    let cancelled = false

    function scrambleTo(next) {
      const length = Math.max(current.length, next.length)
      const queue = []
      for (let i = 0; i < length; i++) {
        const start = Math.floor(Math.random() * 20)
        const end = start + 10 + Math.floor(Math.random() * 20)
        queue.push({ from: current[i] || '', to: next[i] || '', start, end, char: '' })
      }
      let frame = 0
      const run = () => {
        if (cancelled) return
        let out = ''
        let done = 0
        for (const q of queue) {
          if (frame >= q.end) { done++; out += q.to }
          else if (frame >= q.start) {
            if (!q.char || Math.random() < 0.28) {
              q.char = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            }
            out += `<span class="text-accent/60">${q.char}</span>`
          } else { out += q.from }
        }
        setHtml(out)
        if (done < queue.length) { frame++; raf.current = requestAnimationFrame(run) }
        else { current = next }
      }
      run()
    }

    function cycle() {
      idx.current = nextIndex(idx.current, words.length)
      const next = words[idx.current]
      if (reduce) { setHtml(next); current = next } else { scrambleTo(next) }
    }

    const timer = setInterval(cycle, interval)
    return () => { cancelled = true; clearInterval(timer); cancelAnimationFrame(raf.current) }
  }, [words, interval])

  // Animated text is decorative; the accessible sentence lives in the Hero's sr-only copy.
  return <span aria-hidden="true" className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
```

- [ ] **Step 6: Build `src/sections/Hero.jsx`** (markup polished with the `frontend-design` skill)

Fetch profile with the resume URL projected: `*[_type == "profile"][0]{..., "resumeUrl": resumePdf.asset->url}`. Render:
```jsx
const ROLES = ['developer', 'student', 'dad', 'ai-enthusiast', 'freelancer', 'future-millionaire']
// ...
<h1 className="text-4xl font-bold tracking-tight md:text-6xl">
  Hey I'm Christian,<br />
  your friendly neighborhood{' '}
  <GlitchText words={ROLES} className="text-accent" />
  <span className="sr-only">
    developer, student, dad, ai-enthusiast, freelancer, and future millionaire
  </span>
</h1>
```
Below the headline: `tagline`/`bio`, a primary button "Get in touch" (`#contact`, `bg-accent text-white`), a secondary "View projects" (`#projects`, bordered), and a "Download resume" link when `resumeUrl` exists (opens in a new tab). Optional `avatar` (rounded, `border-border`). Add top padding so the headline clears the sticky navbar.

- [ ] **Step 7: Delete the old header**
```bash
git rm -r src/container/Header
```

- [ ] **Step 8: Verify** — the role glitch-cycles through all six words on a loop; scramble looks smooth; with OS "reduce motion" enabled the role swaps without scrambling; hero renders in both themes; buttons scroll to their sections; the resume link opens the PDF.

- [ ] **Step 9: Commit**
```bash
git add -A
git commit -m "feat: hero with glitchy role text animation"
```

### Task 8.2: About

**Files:** Create `src/sections/About.jsx`; delete `src/container/About/`.

- [ ] **Step 1:** Fetch `ABOUTS`. Render a short intro paragraph (from `profile.bio` or a lead), then a responsive grid of about cards (`image`, `title`, `description`) in `bg-surface border border-border rounded-xl` cards. Use `<Reveal delay={i*0.05}>` per card.
- [ ] **Step 2:** `git rm -r src/container/About`
- [ ] **Step 3: Verify** in both themes + mobile. **Step 4: Commit.**

### Task 8.3: Experience (resume centerpiece)

**Files:** Create `src/sections/Experience.jsx`.

- [ ] **Step 1:** Fetch `EXPERIENCES`. Render a vertical list/timeline; each entry: `role` @ `company` (company links to `companyUrl`), `location`, `formatDateRange(startDate, endDate, current)` (right-aligned, `text-muted`, optionally mono), and `highlights[]` as a bulleted list. Optional `logo`. Left border/rail for timeline feel.
- [ ] **Step 2: Verify** dates format correctly (import `formatDateRange`), both themes, mobile stacks cleanly. **Step 3: Commit.**

### Task 8.4: Projects

**Files:** Create `src/sections/Projects.jsx`; delete `src/container/Work/`.

- [ ] **Step 1:** Fetch `PROJECTS`. Responsive card grid (`sm:grid-cols-2 lg:grid-cols-3`): `urlFor(project.image)` cover, `title`, `description`, `tags` as chips, and icon links (`react-icons` `FiExternalLink` → `projectLink`, `FiGithub` → `codeLink`) shown on hover/focus. Keep the tag-filter feature optional (YAGNI — omit unless desired). Guard against missing `image`.
- [ ] **Step 2:** `git rm -r src/container/Work`
- [ ] **Step 3: Verify** grid responsive, links open new tab, both themes. **Step 4: Commit.**

### Task 8.5: Skills

**Files:** Create `src/sections/Skills.jsx`; delete `src/container/Skills/`.

- [ ] **Step 1:** Fetch `SKILLS`, group via `groupByCategory`. Render one column/block per category (Frontend/Backend/Tools/Other), each a wrap of skill chips (`urlFor(skill.icon)` + `name`) in bordered pills. Skip empty categories.
- [ ] **Step 2:** `git rm -r src/container/Skills`
- [ ] **Step 3: Verify** grouping renders, both themes. **Step 4: Commit.**

### Task 8.6: Education

**Files:** Create `src/sections/Education.jsx`.

- [ ] **Step 1:** Fetch `EDUCATION`. Card/timeline entries: `school`, `degree` in `field`, `location`, date range (`formatDateRange(startDate, endDate, false)` or just years), `description`, optional `logo`. Mirror the Experience visual language for consistency.
- [ ] **Step 2: Verify** both themes + mobile. **Step 3: Commit.**

### Task 8.7: Footer + assemble App

**Files:** Create `src/components/Footer.jsx`; rewrite `src/App.js` → `src/App.jsx`; delete `src/container/Footer/`, `src/container/index.js`, `src/components/index.js`, `src/App.scss`, `src/constants/`.

- [ ] **Step 1:** `Footer.jsx`: minimal — name, `profile.socials` icon links (map `platform` → `react-icons`), copyright year, thin top border.
- [ ] **Step 2:** Rewrite `App.jsx`:
```jsx
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Education from './sections/Education'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        {/* <Contact /> is added in Phase 9.2 */}
      </main>
      <Footer />
    </div>
  )
}
```

> Note: `Contact` is built and wired into `App.jsx` in Phase 9.2, so the page has no contact section at this checkpoint (still a valid, building state).
- [ ] **Step 3:** `git mv src/App.js src/App.jsx` (adjust for the rewrite), delete obsolete barrels/scss/constants, fix any remaining imports.
- [ ] **Step 4: Verify** full page top-to-bottom in both themes, mobile + desktop, `npm run build` succeeds with no unresolved imports.
- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: assemble redesigned page (footer + section order)"`

---

## PHASE 9 — Contact via Netlify Forms + deploy config

### Task 9.1: Netlify form encoder (TDD)

**Files:** Create `src/lib/netlify.js`; Test `src/lib/netlify.test.js`.

- [ ] **Step 1: Failing test**
```js
import { describe, it, expect } from 'vitest'
import { encode } from './netlify'

describe('encode', () => {
  it('url-encodes form fields', () => {
    expect(encode({ 'form-name': 'contact', name: 'Ada L', email: 'a@b.co' }))
      .toBe('form-name=contact&name=Ada%20L&email=a%40b.co')
  })
})
```
- [ ] **Step 2: Run** `npm test -- netlify` → FAIL.
- [ ] **Step 3: Implement**
```js
export function encode(data) {
  return Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&')
}
```
- [ ] **Step 4: Run** `npm test -- netlify` → PASS.
- [ ] **Step 5: Commit** `git add src/lib/netlify.* && git commit -m "feat: netlify form encoder with test"`

### Task 9.2: Contact section + static form detection

**Files:** Create `src/sections/Contact.jsx`; Modify `index.html` (hidden detection form).

- [ ] **Step 1:** Add a hidden static form to `index.html` `<body>` so Netlify's build-time bot detects it:
```html
<form name="contact" netlify netlify-honeypot="bot-field" hidden>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <textarea name="message"></textarea>
</form>
```
- [ ] **Step 2:** Build `Contact.jsx` (with `frontend-design` skill): controlled `name/email/message` fields + honeypot `bot-field`, styled with tokens. On submit, POST to `/`:
```jsx
import { useState } from 'react'
import { encode } from '../lib/netlify'
// ...
const [form, setForm] = useState({ name: '', email: '', message: '' })
const [sent, setSent] = useState(false)
const [error, setError] = useState(false)

async function onSubmit(e) {
  e.preventDefault()
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'contact', 'bot-field': '', ...form }),
    })
    if (!res.ok) throw new Error()
    setSent(true)
  } catch { setError(true) }
}
```
The rendered `<form>` needs `name="contact"`, `data-netlify="true"`, `netlify-honeypot="bot-field"`, and a hidden `<input type="hidden" name="form-name" value="contact" />`. Show a success state when `sent`, an error message when `error`, and social links from `profile`.
- [ ] **Step 3: Wire Contact into the page** — in `src/App.jsx` add `import Contact from './sections/Contact'` and render `<Contact />` between `<Education />` and the closing `</main>` (replacing the Phase-8 placeholder comment).
- [ ] **Step 4: Verify** locally the form renders and validates (actual submission only works on deployed Netlify — note this in the commit).
- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: contact section via netlify forms"`

### Task 9.3: netlify.toml

**Files:** Create `netlify.toml`.

- [ ] **Step 1:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
- [ ] **Step 2: Verify** `npm run build && npm run preview` serves the built site at the preview URL with working client routing.
- [ ] **Step 3: Commit** `git add netlify.toml && git commit -m "build: netlify config (dist + SPA redirect)"`

---

## PHASE 10 — Docs + final verification

### Task 10.1: Update documentation

**Files:** Modify `README.md`, `CLAUDE.md`, `backend_sanity/CLAUDE.md`.

- [ ] **Step 1:** Rewrite `README.md`: project summary, stack, `npm run dev/build/preview/test`, env vars (`VITE_SANITY_*`), Sanity Studio commands (`cd backend_sanity && npm run dev`), Netlify deploy notes, and that the contact form uses Netlify Forms.
- [ ] **Step 2:** Update root `CLAUDE.md`: remove CRA/SCSS/Three.js/HOC descriptions; document Vite + Tailwind v4 tokens + dark mode (ThemeProvider/no-flash), the Section/Reveal/Navbar primitives, `lib/` (sanity/queries/format/theme/netlify), the section list, and that the frontend uses tokenless public reads + Netlify Forms.
- [ ] **Step 3:** Update `backend_sanity/CLAUDE.md`: Studio v3 (`sanity.config.ts`, `sanity dev`), the new content model table (profile/experience/education/work/about/skill), the profile singleton, normalized image field names, and that testimonials/brands/contact types were removed.
- [ ] **Step 4: Commit** `git add -A && git commit -m "docs: update for vite/tailwind/dark-mode/sanity-v3"`

### Task 10.2: Final verification pass

- [ ] **Step 1: Tests** — `npm test` → all pass.
- [ ] **Step 2: Build** — `npm run build` → succeeds, no warnings about unresolved imports.
- [ ] **Step 3: Manual** — `npm run preview`; walk every section on mobile + desktop widths in both light and dark; toggle persists across reload with no flash; all links/anchors work; compare against the live site `christian-bermeo.netlify.app`.
- [ ] **Step 4: Studio** — `cd backend_sanity && npm run dev`; confirm all six types edit correctly and Profile is a singleton.
- [ ] **Step 5: Dead code sweep** — grep for leftover `scss`, `framer-motion`, `three`, `AppWrap`, `MotionWrap`, `client.js` imports; none should remain.

---

## Deployment checklist (user actions, post-merge)
- [ ] Revoke the leaked `REACT_APP_SANITY_TOKEN` in sanity.io/manage → API → Tokens.
- [ ] In Netlify → Site settings → Environment variables: add `VITE_SANITY_PROJECT_ID=0bxjr1em`, `VITE_SANITY_DATASET=production`; remove old `REACT_APP_*` vars.
- [ ] Confirm Netlify build settings use `netlify.toml` (publish `dist`).
- [ ] Enable form notifications in Netlify → Forms.
- [ ] Repopulate content in the new Sanity Studio (Profile, Experience, Education, Projects, About, Skills).
- [ ] Verify the Sanity `production` dataset is public (Studio → API → sharing) so tokenless reads work.

## Risks & mitigations
- **React 19 peer compat** with `motion`/`react-icons`: after installs, run `npm run build`; if peer errors, pin `react`/`react-dom` to `^18.3`.
- **Sanity v3 migration** is isolated to Phase 5 and touches only `backend_sanity/`; the frontend keeps building throughout. `projectId`/dataset are unchanged, so existing content stays reachable (fields renamed → re-enter content, which the user is doing anyway).
- **Field renames** break old documents: acceptable — content is being refilled. Old-typed docs (testimonials/brands) can be deleted in the Studio.
- **Netlify Forms** only work on the deployed site; local submission is expected to no-op. If the user later wants submissions in Sanity, swap `Contact.jsx`'s POST for a Netlify Function that holds a write token server-side.
