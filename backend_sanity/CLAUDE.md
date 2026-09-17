# CLAUDE.md — Sanity Studio (backend_sanity)

Guidance for the Sanity content backend. See the root `CLAUDE.md` for the frontend that consumes this data.

> **Frontend has migrated; this Studio has not (yet).** The root frontend has been modernized to Vite + Tailwind CSS v4 + dark mode, and already queries/renders a *new* content model (profile, experience, education, etc. — see root `CLAUDE.md` and `src/lib/queries.js`/`src/lib/fixtures.js`). This Studio is still **v2** with the **old** content model described below (`works`, `abouts`, `experiences`/`workExperience`, `testimonials`, `brands`, `contact`). A Studio v2 → v8 migration, including dropping `testimonials`/`brands` and adding the new document types, is **planned but not yet done**. Until then, the frontend's dev fixtures cover the shapes this Studio doesn't yet produce, and the content model below remains accurate for what actually exists in Sanity today.

## What this is

The **Sanity Studio v2** (content admin UI + schema definitions) for the portfolio. It is a self-contained project with its **own `node_modules`, its own `package.json`, and yarn** (not npm). It shares the Sanity project `0bxjr1em` / dataset `production` with the frontend — the frontend reads this data at runtime via `src/client.js`.

```bash
yarn start   # sanity start → studio at http://localhost:3333
yarn build   # sanity build
```

## Studio v2 — not v3

This is the **legacy Studio v2 architecture**, which is structurally different from current Sanity docs (v3+):

- Config lives in **`sanity.json`** (project id, dataset, plugins, `parts`) — there is no `sanity.config.js`.
- Schemas are wired through the **parts system**: `sanity.json` points to `schemas/schema.js`, which imports `part:@sanity/base/schema-creator` and `concat`s every document type.
- Deps are `@sanity/base@^2` etc., and the Studio runs on **React 17** (the frontend is React 18). Don't assume v3 APIs (`defineType`, `sanity.config.ts`, `structureTool`) — they don't apply here. Migrating to v3 would be a full rewrite, not an incremental change.

## Adding or changing a schema

1. Create `schemas/<type>.js` exporting a default `{ name, title, type: 'document', fields: [...] }` object.
2. Import it in `schemas/schema.js` and add it to the `.concat([...])` array. **Both steps are required** — a file that isn't concatenated is invisible to the Studio.
3. If the frontend consumes the type, update the corresponding container in `src/container/` too — field names are matched by exact string, there's no shared type contract.

## Content model

Each document type, its fields, and where the frontend reads it:

| Type             | Fields                                              | Consumed by (frontend)        |
|------------------|----------------------------------------------------|-------------------------------|
| `works`          | title, description, projectLink, codeLink, `imgUrl`, tags[] | `container/Work` |
| `abouts`         | title, description, `imgUrl`                        | `container/About`             |
| `skills`         | name, bgColor, icon (image)                         | `container/Skills`            |
| `experiences`    | year, works[] → inline `workExperience` objects     | `container/Skills`            |
| `workExperience` | name, company, desc                                | embedded in `experiences`     |
| `testimonials`   | name, company, `imgurl`, feedback                  | `container/Testimonial`       |
| `brands`         | `imgUrl`, name                                      | `container/Testimonial`       |
| `contact`        | name, email, message (text)                        | **written** by `container/Footer` |

### Gotchas in the content model

- **Image field casing is inconsistent.** Every image field is `imgUrl` **except `testimonials`, which is `imgurl`** (lowercase). The frontend reads each with its exact casing (`test.imgurl` vs `brand.imgUrl`). If you rename to normalize, you must change the schema, the frontend read, and migrate existing documents together — otherwise images silently break.
- **`contact` is write-only from the app.** The Footer form calls `client.create({ _type: 'contact', ... })`. This means the frontend's `REACT_APP_SANITY_TOKEN` needs **write (Editor) permission**, and submitted messages appear as `contact` documents in the Studio. Nothing reads them back.
- **`workExperience` is both a document type and an inline object.** `experiences.works` embeds it via `of: [{ type: 'workExperience' }]`. Edit experience entries through the parent `experiences` document, not as standalone `workExperience` documents.
