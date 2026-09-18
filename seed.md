# Initial seed data — content tracker

Source of truth for the content seeded into Sanity (`production`, project `0bxjr1em`).
**Workflow:** edit here → apply with `cd backend_sanity && npx sanity exec scripts/seed.js --with-user-token`.
Field names match `src/lib/queries.js` (and the dev fixtures in `src/lib/fixtures.js`).

Legend: ✅ finalized · ✏️ placeholder — **confirm/replace with real info** · (?) needs confirmation

---

## Profile (singleton — `profile`)

- **name:** Christian Bermeo ✅
- **title:** Software Developer ✏️ (or e.g. "Full-stack / Creative Developer")
- **tagline:** I build fast, accessible web and mobile apps — end to end. ✏️
- **bio:** Full-stack developer focused on clean, performant React front-ends and pragmatic, well-tested back-ends. The details matter to me. ✏️
- **email:** hello@cbermeo.com ✅
- **avatar:** _removed — no photo for now_ ✅
- **socials:**
  - github → https://github.com/christiancabp ✅
  - linkedin → https://www.linkedin.com/ ✏️ (add your real profile URL)

---

## Projects (`work`) — newest → oldest

Card image = screenshot at `public/images/projects/<slug>.png` (auto-captured from the live sites).

### 1. Face Sculpting Bar `face-sculpting-bar`
- **description:** Freelance production website for a facial-sculpting & skincare studio — branding, services, and booking. ✏️
- **stack / tags:** [React, Freelance] (?) — confirm the real stack
- **live:** https://facesculptingbar.com
- **repo:** https://github.com/christiancabp/face-sculpting-bar _(private)_
- **image:** /images/projects/face-sculpting-bar.png

### 2. Space Assault `space-assault`
- **description:** A 3D arcade shooter reimagining Space Invaders, rendered in the browser with WebGL.
- **stack / tags:** [Three.js, WebGL, Game]
- **live:** https://space-assault.vercel.app/
- **repo:** https://github.com/christiancabp/space-assault
- **image:** /images/projects/space-assault.png

### 3. Hangman 3D `hangman-3d`
- **description:** A playful 3D take on the classic Hangman word game.
- **stack / tags:** [Three.js, Game]
- **live:** https://hangman-3d.vercel.app/
- **repo:** https://github.com/christiancabp/Hangman-3D
- **image:** /images/projects/hangman-3d.png

### 4. Raging Sea `raging-sea`
- **description:** A real-time animated ocean surface driven by custom GLSL vertex & fragment shaders.
- **stack / tags:** [Three.js, GLSL, Shaders]
- **live:** https://raging-sea-snowy.vercel.app/
- **repo:** https://github.com/christiancabp/RagingSea-threeJS
- **image:** /images/projects/raging-sea.png

### 5. C.H.A.R.L.I. `charli`
- **description:** A JARVIS-inspired personal AI assistant (voice + chat), built on top of OpenCLAW. ✏️
- **stack / tags:** [Python, AI] (?) — confirm the real stack
- **live:** — _(no public site)_
- **repo:** https://github.com/christiancabp/CHARLI
- **image:** — no live site to screenshot; add a logo/screenshot manually or leave imageless

---

## Experience (`experience`) — newest → oldest

### 1. Software Developer — PCI ✏️
- **url:** https://www.pci.us · **location:** Remote · **dates:** Mar 2023 – Present (current)
- **highlights:** ✏️
  - Built and shipped React features used across internal tools.
  - Improved page performance and accessibility across the app.

### 2. Junior Developer — Freelance ✏️ _(placeholder — replace with your real role/history)_
- **location:** Remote · **dates:** Jun 2021 – Feb 2023
- **highlights:**
  - Delivered client web apps end-to-end (React + Node).

---

## Education (`education`)

- **school:** University ✏️ (your real school) · **degree:** B.S. ✏️ · **field:** Computer Science ✏️
- **dates:** Sep 2017 – May 2021 ✏️
- **description:** Focus on software engineering and web development. ✏️

---

## Skills (`skill`) — name · category

| Name | Category |
|------|----------|
| React | Frontend |
| JavaScript | Frontend |
| HTML | Frontend |
| CSS | Frontend |
| Sass | Frontend |
| Redux | Frontend |
| Node.js | Backend |
| Git | Tools |

**Suggested additions** (given your projects lean 3D/WebGL): Three.js · Frontend · GLSL/Shaders · Frontend · Vite · Tools · Python · Backend (for C.H.A.R.L.I.). ✏️

---

## About (`about`) — cards

_Note: the placeholder about images were removed; about cards now render text-only (title + description)._

1. **Front-end** — React, component systems, and accessible, responsive UI. ✏️
2. **Back-end** — Node APIs, data modeling, and integrations. ✏️
3. **Craft** — Performance, testing, and clean, maintainable code. ✏️
