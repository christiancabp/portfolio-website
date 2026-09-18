# Initial seed data — content tracker

Source of truth for the content seeded into Sanity (`production`, project `0bxjr1em`).
**Workflow:** edit here → apply with `cd backend_sanity && npx sanity exec scripts/seed.js --with-user-token`.
Field names match `src/lib/queries.js` (and the dev fixtures in `src/lib/fixtures.js`).

Legend: ✅ finalized · ✏️ placeholder — **confirm/replace with real info** · (?) needs confirmation

---

## Profile (singleton — `profile`)

- **name:** Christian Bermeo ✅
- **title:** Software Engineer / Creative Developer
- **tagline:** I build fast, production ready web and mobile apps — end to end.
- **bio:** Full-stack developer focused on clean, performant React front-ends and pragmatic, well-tested back-ends. The details matter to me.
- **email:** hello@cbermeo.com ✅
- **avatar:** _removed — no photo for now_ ✅
- **resume:** `public/resume/Christian Bermeo Resume 2026.pdf` → uploaded to Sanity `profile.resumePdf` (powers the "Download resume" button) ✅
- **socials:**
  - github → https://github.com/christiancabp ✅
  - linkedin → https://www.linkedin.com/in/christian-bermeo-679023185/ ✅

---

## Projects (`work`) — newest → oldest

Card image = screenshot at `public/images/projects/<slug>.png` (auto-captured from the live sites).

### 1. Face Sculpting Bar `face-sculpting-bar`
- **description:** Freelance production website for a skincare studio — branding, SEO optimized, services menu, and booking link.
- **stack / tags:** [Next.js, TailwindCSS, TypeScript]
- **live:** https://facesculptingbar.com
- **repo:** https://github.com/christiancabp/face-sculpting-bar _(private)_
- **image:** /images/projects/face-sculpting-bar.png

### 2. Space Assault `space-assault`
- **description:** A 3D arcade shooter reimagining Space Invaders, rendered in the browser with WebGL.
- **stack / tags:** [Three.js, React, TypeScript, Shaders, Game]
- **live:** https://space-assault.vercel.app/
- **repo:** https://github.com/christiancabp/space-assault
- **image:** /images/projects/space-assault.png

### 3. Hangman 3D `hangman-3d`
- **description:** A playful 3D take on the classic Hangman word game.
- **stack / tags:** [Three.js, React, TypeScript, Game]
- **live:** https://hangman-3d.vercel.app/
- **repo:** https://github.com/christiancabp/Hangman-3D
- **image:** /images/projects/hangman-3d.png

### 4. Raging Sea `raging-sea`
- **description:** A real-time animated ocean surface driven by custom GLSL vertex & fragment shaders.
- **stack / tags:** [Three.js, JavaScript, Shaders]
- **live:** https://raging-sea-snowy.vercel.app/
- **repo:** https://github.com/christiancabp/RagingSea-threeJS
- **image:** /images/projects/raging-sea.png

### 5. C.H.A.R.L.I. `charli`
- **description:** A JARVIS-inspired personal AI assistant (voice + chat), built on top of OpenCLAW with Gemini as the brain.
- **stack / tags:** [Python, OpenClaw, TypeScript]
- **live:** — _(no public site)_
- **repo:** https://github.com/christiancabp/CHARLI
- **image:** /images/projects/charli.png

---

## Experience (`experience`) — newest → oldest

### 1. Software Developer — PCI
- **url:** https://www.pci.us · **location:** Remote · **dates:** Sep 2022 – Present (current)
- **highlights:** 
  - Design and implement end to end features used by real production users of an ERP system.
  - Improved page user experience and accessibility across the app.

### 2. Service Member — United States Army
- **location:** Long Island, NY · **dates:** Dec 2020 – Aug 2021
- **highlights:**
  - Worked for the New York Joint Task Force covid response mission in a vaccination pop-up clinic.
  - Provided operational support at the Jones Beach vaccination site and alternate care facility

---

## Education (`education`)

- **school:** New Jersey Institute of Technology (NJIT)· **degree:** B.S.  · **field:** Computer Science 
**dates:** Sep 2026 – Present ·
**description:** Focus on Artificial Intelligence and Robotics. 
expected graduation date: May 2029

- **school:** LaGuardia Community College (LAGCC)· **degree:** A.S.  · **field:** Computer Science 
**dates:** Sep 2017 – May 2026
**description:** Focus on Computer Science.

---

## Skills (`skill`) — name · category

| Name | Category |
|------|----------|
| React | Frontend |
| Next.js | Frontend |
| TailwindCSS | Frontend |
| TypeScript | Frontend |
| JavaScript | Frontend |
| HTML | Frontend |
| CSS | Frontend |
| Three.js | Frontend |
| Node.js | Backend |
| Python | Backend |
| Django | Backend |
| SQL | Backend |
| MongoDB | Backend |
| PostgreSQL | Backend |
| Redis | Backend |
| AWS | Backend |
| Git | Tools |
| Docker | Tools |
| OpenClaw | Tools |
| Claude Code | Tools |
| DevOps | Tools |
| CI/CD | Tools |

_Skill icons are rendered from **react-icons** (monochrome, theme-tinted) by name — no image files needed. To give a new skill an icon, add its name to `SKILL_ICONS` in `src/sections/Skills.jsx` (unmapped skills fall back to a generic glyph)._

---

## About (`about`) — cards

_Note: the placeholder about images were removed; about cards now render text-only (title + description)._

1. **Front-end** — React, Next.js, TailwindCSS, TypeScript, component systems, and accessible, responsive UI. 
2. **Back-end** — Node.js, Django, Python, SQL databases, Caching, data modeling, and microservices. 
3. **Tools** — Git, Docker, OpenClaw, Claude Code, AWS cloud services.
