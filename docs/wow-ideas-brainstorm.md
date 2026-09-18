# Portfolio "wow" ideas — brainstorm

**Date:** 2026-09-18
**Status:** Brainstorm for review — nothing built yet. Let's pick 1–2 to prototype.

> Goal: give a visitor the *"oh, that's actually cool"* reaction — make the visit feel worth it —
> **without** turning the site into a slow, inaccessible tech-demo. Ideas below are tailored to
> **you specifically**, because your unfair advantages are rare: you already ship **Three.js +
> GLSL shaders** (Raging Sea, Space Assault, Hangman 3D) *and* **AI** (C.H.A.R.L.I.), and we've
> got a strong **terminal-editorial** identity to build on.

---

## Guiding principle: layered "wow", not a 3D gamble

The coolest 3D portfolios (Bruno Simon's drivable-car site is the classic — and note **Raging Sea
is literally from Bruno's Three.js Journey course**, so that world is *in your skillset*) are
stunning… but many are also **slow to load, rough on mobile, invisible to recruiters skimming on a
phone, and bad for SEO/accessibility**. A recruiter who bounces before the scene loads is worse
than a boring site.

So the strong play isn't "replace everything with 3D." It's **layered**:

- **Keep** the fast, accessible, content-rich base we built (great for recruiters, phones, SEO,
  the share-card).
- **Add** one or two *signature* interactive experiences on top — ideally ones that **double as
  proof of your skills** (a shader IS a portfolio piece; a working terminal IS a flex).
- Everything heavy is **lazy-loaded, mobile-aware, and `prefers-reduced-motion`-respecting**, with
  a graceful fallback.

That gets you the "wow" *and* keeps the site usable. Below: the catalog, then my ranked picks.

---

## The idea catalog

Effort = rough build size (S = hours, M = a day-ish, L = multi-day). Each notes the trade-off.

### 🌌 3D / WebGL (your wheelhouse — these double as portfolio pieces)

1. **Interactive shader hero background** — replace the current static grid/glow behind the hero
   with a **live GLSL shader**: a slow, dark, accent-tinted flow field / fluid / noise-displaced
   plane that subtly reacts to the cursor. It's a smaller cousin of Raging Sea.
   *Wow:* high, and it silently proves you write shaders. *Fits:* elevates the existing hero.
   *Effort:* **M**. *Trade-off:* GPU cost — cap DPR, pause offscreen, static image fallback on
   mobile / reduced-motion. **My favorite "showcase your craft" option.**

2. **The whole site as a navigable 3D world** — the moonshot. Scroll or fly through a scene where
   each section is a place/object; maybe a tiny controllable ship (reuse Space Assault vibes).
   *Wow:* maximum. *Fits:* it's the "3D experience" you admire. *Effort:* **L**. *Trade-off:* the
   big one — perf, mobile, a11y, SEO, and long build. Best done as an **optional "3D mode"** or a
   dedicated route, not forced on every visitor. High risk / high reward.

3. **3D easter-egg mini-game** — Konami code (or a `play` command in the terminal, see below)
   launches a tiny playable game — fly a ship and shoot the section headings, or a micro Space
   Assault. *Wow:* delightful, memorable, shareable. *Fits:* playful, rewards curiosity.
   *Effort:* **M–L**. *Trade-off:* scope creep; keep it *tiny*.

4. **Interactive 3D project objects** — each project shows a small rotating/interactive 3D
   thing (a floating game cartridge, a mini shader plane for Raging Sea, a wireframe ship for
   Space Assault). *Wow:* medium-high. *Effort:* **M**. *Trade-off:* several canvases = perf; use
   one shared renderer or render-on-hover only.

### 🤖 AI / interactive (leverages C.H.A.R.L.I. — few devs can do this)

5. **"Ask my portfolio" — chat with C.H.A.R.L.I.** — an embedded assistant that answers questions
   about you: *"What's your React experience?"*, *"Tell me about Space Assault"*, *"Is he a good
   fit for a frontend role?"* Grounded in your real content (feed it the Sanity data / resume).
   *Wow:* high **and genuinely useful** — a recruiter can interview your resume. Almost nobody
   does this well. *Fits:* it's literally your project (CHARLI), on-brand with the terminal.
   *Effort:* **M** (needs a serverless proxy — Netlify Function — to hide the LLM key; stream the
   response). *Trade-off:* API cost/abuse (add rate-limiting), and it must feel fast (stream tokens).

### ⌨️ Terminal (perfect fit for the identity we already have)

6. **A real, interactive terminal** — the `cbermeo:~$` motif becomes a *working* CLI. Type
   `help`, `ls projects`, `cat about`, `open space-assault` (launches the live-preview modal!),
   `whoami`, `theme dark`, `sudo hire-me` → contact, `resume` → download. *Wow:* high, and it's
   **cohesive, not gimmicky — it IS the theme.** Discoverable via a persistent prompt or a `Ctrl+K`
   palette. *Fits:* perfectly. *Effort:* **M**. *Trade-off:* keep it a *delight layer* over the
   normal UI (never the only way to navigate). **Best wow-per-effort + most on-brand.**

7. **Boot sequence intro** — first visit plays a brief fake boot (`cbermeo OS v1.0 booting…`,
   mounting sections, then reveal), typed out. *Wow:* memorable first impression. *Effort:* **S–M**.
   *Trade-off:* can annoy on repeat visits — show once (localStorage), keep it &lt;1.5s, skippable.

8. **Command palette (`Ctrl/⌘+K`)** — jump to sections, toggle theme, open a project, copy email.
   *Wow:* "this dev has taste." *Effort:* **S**. *Trade-off:* low; a safe, classy touch.

### ✨ Motion / sensory (lighter, safer polish)

9. **Custom cursor + magnetic buttons** — a subtle custom cursor that reacts to interactives.
   *Effort:* **S**. *Trade-off:* must feel good on trackpads; disable on touch.
10. **Tasteful sound design** — soft mechanical-keyboard/terminal ticks on key interactions,
    **off by default** with a visible toggle. *Wow:* distinctive if restrained. *Effort:* **S–M**.
    *Trade-off:* sound is high-risk/annoying — opt-in only.
11. **Scroll-driven "typing"** — section content types in / a scroll progress rendered as a
    loading bar or prompt. *Effort:* **S–M**. *Trade-off:* don't fight readability.

### 📊 Content / concept

12. **Live "now" + GitHub feed** — a terminal-styled live commit ticker / contribution graph /
    "currently building X". *Wow:* shows you're active. *Effort:* **M** (GitHub API + a function).
13. **Shader playground** — expose the Raging Sea uniforms (that lil-gui panel!) so visitors tweak
    your shader live. *Wow:* high for the technical crowd. *Effort:* **M**. *Trade-off:* niche.

---

## My take — ranked picks

If I were building yours, in this order:

1. **Interactive terminal (#6).** Highest wow-per-effort, *perfectly* on-brand, and it ties the
   existing pieces together (it can open the live-preview modal, download the resume, toggle theme).
   It reframes the whole site from "nice template" to "this person is different."
2. **Shader hero (#1).** One tasteful WebGL layer that quietly screams "I write shaders." Elevates
   the hero we already have; contained perf cost.
3. **Ask-C.H.A.R.L.I. chat (#5).** The genuinely novel, *useful* one — and it showcases your AI
   work. Great differentiator for recruiters.
4. **Command palette (#8) + boot intro (#7)** as low-cost delight around the above.
5. **Full 3D world (#2)** as a later *moonshot* — do it as an optional "3D mode"/route so it never
   compromises the fast base. This is the ultimate version of what you admire; worth it once the
   fundamentals shine.

**Combo I'd pitch:** *Terminal + shader hero* first (cohesive, achievable, high wow), then
*Ask-CHARLI*. That trio is distinctive, plays entirely to your strengths, and keeps the site fast
and recruiter-friendly.

---

## If/when we do 3D, do it right (a checklist)

- **Lazy-load** the WebGL/Three.js bundle (dynamic `import()`) so it never blocks first paint.
- **Perf budget:** cap `devicePixelRatio` (≤2), pause the render loop when offscreen/tab-hidden,
  keep draw calls low.
- **Mobile:** detect + serve a lighter or static fallback; test on a real phone.
- **`prefers-reduced-motion`:** freeze/replace animation with a still.
- **Accessibility & SEO:** keep the real, crawlable HTML content underneath — the 3D is an
  enhancement layer, not the only content.
- **Graceful failure:** if WebGL is unavailable, fall back to the current design.

---

## Next step

Tell me which 1–2 spark that *"wow"* for you and I'll prototype them. My vote: **start with the
interactive terminal + shader hero** — biggest, most on-brand payoff for the effort, and a perfect
lead-in to a later full-3D "mode" if you want to chase the moonshot.
</content>
