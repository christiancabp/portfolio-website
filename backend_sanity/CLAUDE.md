# CLAUDE.md — Sanity Studio (backend_sanity)

Guidance for the Sanity content backend. See the root `CLAUDE.md` for the frontend that consumes this data.

## What this is

The **Sanity Studio** (content admin UI + schema definitions) for the portfolio. It is a self-contained project with its own `node_modules`, its own `package.json`, and **npm** (not yarn). It shares the Sanity project `0bxjr1em` / dataset `production` with the frontend — the frontend reads this data at runtime via `src/lib/sanity.js`.

```bash
npx sanity login   # one-time browser auth, needed before first dev/deploy
npm run dev         # sanity dev → studio at http://localhost:3333
npm run build        # sanity build
npm run deploy        # sanity deploy
```

There is no access token anywhere in this project or the frontend: the Studio authenticates interactively via `sanity login`, and the live site reads the `production` dataset anonymously (it's public — see root `README.md` for the CORS/visibility setup).

## Current Sanity Studio (v6, not legacy v2)

This runs the current Sanity Studio architecture:

- Config lives in **`sanity.config.ts`**, built with `defineConfig` — project id, dataset, and plugins (`structureTool`, `visionTool`) are declared there. `sanity.cli.ts` (via `defineCliConfig`) holds the project id/dataset the CLI itself uses for `dev`/`build`/`deploy`.
- Schemas are plain TypeScript modules under `schemaTypes/`, each built with `defineType`/`defineField` and exported from `schemaTypes/index.ts` as the `schemaTypes` array, which is passed straight into `defineConfig({ schema: { types: schemaTypes } })`. There is no parts system and no `sanity.json`.
- Deps are `sanity@^6.15.0` and `@sanity/vision@^6.15.0`, and the Studio runs on **React 19** (matches the frontend's React version). Note: the globally-installed `@sanity/cli` package version (8.x) is independent of the `sanity` library version used by this Studio — they're versioned separately and 8.x tooling running a 6.x Studio is expected/normal.
- `structureTool` is configured with a custom structure (`sanity.config.ts`) that pins **Profile** as a singleton list item (`S.document().schemaType('profile').documentId('profile')`) above a divider, followed by the regular document-type list for everything else.

## Adding or changing a schema

1. Create `schemaTypes/<type>.ts` exporting a default `defineType({...})` (see any existing file for the pattern — `defineField` for individual fields, `preview`/`orderings` as needed).
2. Import it in `schemaTypes/index.ts` and add it to the `schemaTypes` array. **Both steps are required** — a type that isn't in that array is invisible to the Studio and to `defineConfig`.
3. If the frontend consumes the type, update the corresponding GROQ query in `src/lib/queries.js` (root project) too — field names are matched by exact string, there's no shared type contract between Studio and frontend.

## Content model

Six document types, matching what the frontend queries (`src/lib/queries.js`) and renders (`src/lib/fixtures.js` for dev fallbacks):

| Type         | Fields                                                                                          | Notes |
|--------------|--------------------------------------------------------------------------------------------------|-------|
| `profile`    | name, title, tagline, bio, email, avatar (image), resumePdf (file), socials[] (`{platform, url}`) | Singleton — pinned in the Studio structure with a fixed `documentId('profile')`. |
| `experience` | role, company, companyUrl, location, startDate, endDate, current (bool), highlights[], logo (image) | Ordered newest-start-first; preview shows role/company. |
| `education`  | school, degree, field, location, startDate, endDate, description, logo (image)                   | Ordered newest-end-first; preview shows school/degree. |
| `work`       | title, description, image, projectLink, codeLink, tags[]                                         | Titled "Project" in the Studio UI; preview shows title/image. |
| `about`      | title, description, image                                                                        | Plain document type, not a singleton — multiple `about` items are expected. |
| `skill`      | name, category (`Frontend`/`Backend`/`Tools`/`Other`), icon (image), bgColor                      | Preview shows name/category/icon. |

Image fields are normalized across all types (`image`/`avatar`/`logo`/`icon`) — there is no more `imgUrl`/`imgurl` casing inconsistency.

### Gone from the old (Studio v2) content model

The previous content model — `works`, `abouts` (as a distinct type from today's `about`), `experiences`/`workExperience`, `testimonials`, `brands`, and `contact` — no longer exists in the schema. In particular:

- `testimonials` and `brands` were dropped entirely (no frontend section consumes them anymore).
- `contact` (the write-only document type the old Footer form used to `client.create()` into) is gone; the current contact form uses Netlify Forms instead (see root `CLAUDE.md`).
- `experiences`/`workExperience` was replaced by the flat `experience` document type above.

**No data migration was performed** as part of this schema migration — only the schema/config code changed. Old v2 documents of the removed types may still linger in the `production` dataset; they're simply not addressable by any current schema type and can be deleted from the Studio's document list if found.
