# JavaScript → TypeScript migration — analysis & plan

**Date:** 2026-09-18
**Status:** For review — no code changed yet.

A pragmatic look at whether (and how) to move this portfolio's **frontend** from JS to TS,
written specifically for *this* codebase, with the trade-offs called out honestly.

---

## TL;DR / recommendation

**Worth doing — it's low-cost here and directly targets the class of bug that just took the
site down** (a null Sanity field → `label().split(undefined)` crash in Education).

- The codebase is **small** (~25 source files) and on **Vite**, which transpiles TS with zero
  extra config → migration is cheap (roughly **half a day to a day**).
- The **backend (`backend_sanity/`) is already TypeScript**, and Sanity can **generate TS types
  from your schema** (`sanity typegen`). That gives *end-to-end typed content* where a nullable
  field (like a missing `startDate`) becomes a **compile error** if you `.split()` it — exactly
  the bug we just hand-patched.
- Recommended path: **incremental** (`allowJs`, migrate leaf-first), adopt **Sanity TypeGen**
  for content types, add a **`typecheck` step** (Vite does *not* type-check on its own).

If you want ~70% of the benefit for ~20% of the effort, there's a **lighter alternative** (JSDoc
types + `checkJs`, no file renames) described at the bottom.

---

## Why consider it here (the motivating bug)

The recent production crash is the poster child for what TS catches:

```js
// src/lib/format.js — before the fix
function label(iso) {
  const [y, m] = iso.split('-')   // 💥 iso was undefined (education with no startDate)
  ...
}
```

We fixed it with a runtime guard. With TypeScript **and** content types where `startDate` is
`string | null` (which is what the Sanity schema actually allows — it's not `required`), this
line would **fail to compile** until guarded:

```ts
function label(iso: string | null): string {
  const [y, m] = iso.split('-')   // ❌ TS2531: Object is possibly 'null'
}
```

You'd be forced to handle the null *before shipping*, not after a user reports a white screen.

---

## Benefits (pros) — specific to this repo

1. **Catches nullable-content bugs at compile time.** Every Sanity field the schema doesn't mark
   `required()` is effectively optional. Typing content (esp. via TypeGen) surfaces every unguarded
   access. This is the single biggest win given how content-driven this site is.
2. **The backend is already TS + schema-derived types are free.** `sanity typegen` reads
   `backend_sanity/schemaTypes/*.ts` + your GROQ queries and emits accurate types (including
   nullability). One source of truth; regenerate when the schema changes.
3. **Autocomplete + safe refactors.** Renaming a field (e.g. `imageUrl` → `image`, which bit us
   during the Sanity migration) becomes a typed refactor — TS flags every stale usage instead of
   failing silently at runtime.
4. **Typed component props.** `Section`, `TimelineEntry`, `ProjectModal`, `Reveal`, `GlitchText`
   have real prop contracts today only by convention. Types make them explicit and self-documenting.
5. **Cheap here.** ~25 small files, all first-party deps ship types (`motion`, `react-icons`,
   `@sanity/client`, `@fontsource/*`). Vite needs no TS build config.
6. **Consistency with the Studio** (already `.ts`) — one language across the repo.

---

## Costs / cons — honest

1. **Type-checking is a separate step.** Vite/esbuild *transpile* TS but do **not** type-check —
   an untyped mistake still builds. You need `tsc --noEmit` (a `npm run typecheck`) wired into CI
   and/or a pre-commit hook, or `vite-plugin-checker` for in-dev errors. That's new infrastructure
   to maintain.
2. **Types are a promise, not a runtime guarantee.** Sanity data is external and editable. Even
   fully typed, if the schema says a field is optional (or someone clears it in the Studio), you
   **still need runtime guards** for anything that must not crash. **TS complements defensive
   coding here; it doesn't replace it.** (The guards we just added stay valuable.)
3. **Migration effort + churn.** ~25 file renames (`.jsx`→`.tsx`, `.js`→`.ts`), adding annotations,
   and fixing the type errors that surface (mostly a good thing, but it's work). Expect a handful
   of "genuinely ambiguous" spots to resolve.
4. **Some ongoing verbosity/ceremony** and a mild learning tax — low for you given your projects
   already use TypeScript (Next.js, R3F games).
5. **TypeGen setup is a small project of its own** (config + a generate script + wiring
   `defineQuery` for typed GROQ). Optional — you can hand-write interfaces instead, but then they
   can drift from the schema.

---

## Does it actually prevent *our* bug? (the nuanced answer)

- **Yes, at the type level** — if content types mark dates as `string | null` (TypeGen does this
  automatically from a non-`required` schema field), the crashing `.split` won't compile.
- **But only if you type the boundary.** `useContent`/`useSanity` currently return `any`-ish data.
  The value comes when their return types are the generated content types, so nullability flows
  into the components.
- **Runtime guards are still needed** for a resilient UI (a mistyped schema, a CDN hiccup returning
  partial data, etc.). So: TS *plus* the defensive patterns we've added — not one or the other.

---

## Migration strategy (incremental, low-risk)

Vite + `allowJs` lets `.js` and `.ts` coexist, so this is **file-by-file**, not big-bang.

### Phase 0 — Tooling (½–1 hr)
- `npm i -D typescript @types/react @types/react-dom @types/node`
- Add `tsconfig.json` (start pragmatic, tighten later):
  ```jsonc
  {
    "compilerOptions": {
      "target": "ESNext", "module": "ESNext", "moduleResolution": "bundler",
      "jsx": "react-jsx", "lib": ["ESNext", "DOM", "DOM.Iterable"],
      "strict": true, "noUncheckedIndexedAccess": true,
      "allowJs": true, "checkJs": false, "skipLibCheck": true,
      "noEmit": true, "types": ["vite/client"]
    },
    "include": ["src"]
  }
  ```
- Add scripts: `"typecheck": "tsc --noEmit"`, and run it in `npm test` / CI.
- (Optional) `vite-plugin-checker` for red squiggles in the dev overlay.

### Phase 1 — Content types (the high-value part) (1–2 hr)
- **Option A (recommended): Sanity TypeGen.** In `backend_sanity/`: `npx sanity schema extract`
  then `npx sanity typegen generate` → a `sanity.types.ts`. Use `defineQuery` for the GROQ strings
  in `src/lib/queries.js` so query *results* are typed. Import the generated types in the frontend.
- **Option B (lighter): hand-write** `src/lib/types.ts` with `Profile`, `Experience`, `Education`,
  `Work`, `Skill`, `About` interfaces (mark optional fields `?`/`| null` to match the schema).
  Faster to start, but can drift from the schema.
- Type `useSanity`/`useContent` as generics: `useContent<Work[]>(PROJECTS, projectsFixture)`.

### Phase 2 — Migrate leaf-first (2–4 hr)
Order so each file's dependencies are already typed:
1. `src/lib/*` (`format`, `content`, `theme`, `netlify`, `glitch`, `sanity`, `queries`, `fixtures`)
   — pure logic, easiest; the `.test.js` files come along (`.test.ts`).
2. `src/hooks/*` (`useSanity`, `useContent`).
3. `src/context/ThemeProvider`, then `src/components/*` (add prop interfaces).
4. `src/sections/*`, then `App` and `main`.
Rename `.jsx→.tsx` / `.js→.ts` per file, fix the errors it surfaces, keep tests green.

### Phase 3 — Tighten & enforce (½ hr)
- Flip `allowJs` off once everything's converted; ensure `strict` is fully on.
- Make `typecheck` a required CI / pre-commit gate so it can't regress.

**Suggested commit cadence:** one commit per phase (or per folder in Phase 2) so it's reviewable.

---

## Effort estimate

| | |
|---|---|
| Small codebase (~25 files), Vite-native TS | **~0.5–1 day** total |
| Highest-value slice alone (tooling + content types + `lib/`+`hooks/`) | **~2–3 hours** |

Because it's incremental, it can be paused at any phase and the app still builds/ships.

---

## Lighter alternative: JSDoc + `checkJs` (no renames)

If a full migration feels like too much churn, you can get a large share of the safety **without
renaming any files**:
- Set `checkJs: true` in `tsconfig.json` and annotate with **JSDoc** (`/** @type {Work[]} */`).
- `tsc --noEmit` then type-checks your `.js` using the same content types (TypeGen still works).
- **Pros:** no file churn, reversible, incremental, catches the nullable-field bugs.
- **Cons:** clunkier syntax than real TS, weaker for complex generics/props, tends to be a
  stepping stone rather than an end state.

This is a reasonable **first step**: adopt content types + `checkJs` now, and convert to `.tsx`
later if it proves its worth.

---

## Recommendation

1. Do **Phase 0 + Phase 1** first (tooling + Sanity TypeGen content types + typed `useContent`).
   That alone would have caught the Education crash and is only a couple of hours.
2. Then decide between finishing the **incremental `.tsx` migration** (clean end state) or staying
   on **JSDoc + `checkJs`** (lighter).
3. **Keep the runtime guards** regardless — types and defensive rendering are complementary for a
   content-driven site people edit freely.
</content>
