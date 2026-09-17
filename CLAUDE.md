# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A single-page personal portfolio site built with Create React App. Content is sourced from a Sanity CMS. The repo contains **two independent projects** with different package managers:

- **`/`** (root) — the React frontend (npm, `react-scripts`)
- **`/backend_sanity`** — the Sanity Studio v2 that defines the content schemas and admin UI (yarn). See `backend_sanity/CLAUDE.md` for the content model and schema conventions.

## Commands

Frontend (run from repo root):

```bash
npm start        # dev server at http://localhost:3000
npm run build    # production build to /build
npm test         # Jest via react-scripts (watch mode); e.g. npm test -- Work.test.js
```

Sanity Studio (run from `backend_sanity/`):

```bash
yarn start       # sanity start — studio at http://localhost:3333
yarn build       # sanity build
```

There are currently **no test files** in the repo despite `npm test` being wired up.

## Environment

`src/client.js` reads two vars from `.env` (gitignored, present locally):

- `REACT_APP_SANITY_PROJECT__ID` — note the **double underscore**
- `REACT_APP_SANITY_TOKEN`

The Sanity project/dataset is `0bxjr1em` / `production` (see `backend_sanity/sanity.json`). Without valid env vars, content sections render empty (fetches fail silently).

## Architecture

### Section + HOC composition

`src/App.js` renders every page section in order. Each section is a container in `src/container/<Name>/` that is exported already wrapped in two higher-order components from `src/wrapper/`:

```js
export default AppWrap(MotionWrap(Work, 'app__works'), 'work', 'app__primarybg');
```

- **`AppWrap(Component, idName, classNames)`** — wraps the section in a full-height `<div id={idName}>` and injects the shared `SocialMedia`, copyright, and `NavigationDots` chrome. The `idName` is load-bearing: it becomes the DOM anchor id, the value `NavigationDots` uses to mark the active dot, and the target of `Navbar` links. When adding a section, its `idName` must match the navigation entry.
- **`MotionWrap(Component, classNames)`** — adds the standard framer-motion `whileInView` fade/slide-up.

Order matters: `AppWrap` is the outer wrapper, `MotionWrap` the inner. Some sections (e.g. the Three.js ones) skip `MotionWrap`.

### Content flow

Content containers fetch from Sanity at mount with GROQ and render the results:

```js
client.fetch('*[_type == "works"]').then(setWorks);
```

Images use `urlFor(source)` from `src/client.js` (a `@sanity/image-url` builder). The document types (`works`, `abouts`, `skills`, `testimonials`, `brands`, `experiences`, `workExperience`, `contact`) are defined in `backend_sanity/schemas/` and registered in `schema.js`. **Changing a content shape means editing both** the Sanity schema and the consuming container.

### Three.js scenes

`src/components/threeJS/ThreeScene.js` and `ThreeProducts.js` are **vanilla Three.js written as React class components** — all setup happens imperatively in `componentDidMount`, appending a `<canvas>` to a `ref`'d mount div. They do **not** use `@react-three/fiber`/`drei` even though those are dependencies. `ThreeScene` also mounts a `lil-gui` debug panel.

Two gotchas here:
- **GLTF models load from `/public`** via runtime paths like `'../../../jedi_star_fighter/scene.gltf'`. These resolve against the page URL, not the module — the `../` segments clamp to the site root, landing on the `public/` model folders. Keep model folders in `public/` and reference them this way.
- **`React.StrictMode` is intentionally disabled** in `src/index.js` (commented out). StrictMode's double-mount breaks the imperative `componentDidMount` Three.js setup (double canvases / GUIs). Don't re-enable it without refactoring the scenes.

### Conventions

- Barrel `index.js` files re-export each directory's modules (`container/`, `components/`, `wrapper/`, `constants/`).
- `src/constants/images.js` centralizes all imported image assets; import from `constants` rather than referencing `src/assets/` directly.
- Styling is SCSS (`node-sass`), one `.scss` per component. Shared global classes (`app__flex`, `head-text`, `p-text`, `bold-text`, `app__primarybg`, `app__container`) live in `src/App.scss` and are relied on across sections.
