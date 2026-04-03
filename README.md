# Surface Area Explorer (You Try)

React + Vite app for middle-school surface-area reasoning: preset solids (sphere, cylinder, cube, prism, hemisphere) with slider-driven dimensions and SVG previews, plus a **custom composite shape** mode (2-block orthographic workflow, per-face inputs, and total-area check). Almost all lesson UI lives in one large presentational/logic module.

**Production:** [https://content-interactives.github.io/you-try-surface-area-/](https://content-interactives.github.io/you-try-surface-area-/)

---

## Stack

| Layer | Notes |
|--------|--------|
| UI | React 19 (`react`, `react-dom`) |
| Build | Vite 6, `@vitejs/plugin-react` |
| Styling | Tailwind CSS 3, PostCSS, Autoprefixer |
| Icons | `lucide-react` |
| 3D (unused in `src/`) | `three`, `@react-three/fiber`, `@react-three/drei` are **declared in `package.json` but not imported** under `src/`; rendering is **SVG + DOM**, not WebGL. Safe candidates for removal if you want a leaner install. |
| Lint | ESLint 9, React Hooks / Refresh plugins |
| Deploy | `gh-pages` → `dist` |

`package.json` sets `"type": "module"`.

---

## Build and dev server

`vite.config.js`:

- `base: '/you-try-surface-area-/'` for GitHub Pages under this repo name (trailing hyphen matches the path).
- `server.port: 8080`, `host: '0.0.0.0'`, `strictPort: true`, `open: true`.

| Script | Command |
|--------|---------|
| Development | `npm run dev` |
| Production bundle | `npm run build` → `dist/` |
| Preview `dist` | `npm run preview` |
| Deploy | `npm run deploy` (`predeploy` → `vite build`, then `gh-pages -d dist`) |

---

## Repository layout

| Path | Role |
|------|------|
| `index.html` | App shell; `#root` |
| `src/main.jsx` | `createRoot`, `StrictMode`, `index.css` |
| `src/App.jsx` | Renders `Sphere` |
| `src/components/Sphere.jsx` | Main interactive: shape selection, `renderShape()` SVG geometry, sliders, multi-step inputs, hints, inline calculator drag/drop, custom “two block” surface-area lesson |
| `src/components/ui/*` | Reusable UI (card, alert, slider, input, button) styled for Tailwind |
| `src/components/sphere/components/Calculator.jsx` | Small snippet-style file (not the calculator used in `Sphere.jsx`, which implements its own state) |
| `src/components/sphere/hooks/useCalculator.js` | Calculator hook (not wired from `App`/`Sphere` in the current tree) |
| `public/fonts/` | Proxima Nova files referenced from injected `@font-face` in `Sphere.jsx` (`/fonts/...` paths) |
| `public/Flexi_Teacher.svg` | Static asset |

---

## Application logic (summary)

- **Modes:** Toggle between **custom composite** (`isCustomShape`) and **preset** solids (`shape`: e.g. cube, sphere, cylinder, prism, hemisphere).
- **Preset branch:** `radius` / `height` (and `minRadius`/`maxRadius` 1–10) drive `renderShape()`, which draws **inline SVG** (isometric-style prism paths, ellipses for sphere/cylinder, etc.). `calculateSurfaceArea`-style helpers use standard formulas (e.g. sphere terms with `4 * Math.PI`, cylinder lateral and caps).
- **Custom branch:** Users work through dimension inputs for two stacked blocks, optional calculation scaffolding (`showCalculations`, `blockCalculations`), and **face-by-face** area entry (`faceInputs` for numbered faces) leading to a **total surface area** field with hints/validation.
- **Calculator:** `Sphere.jsx` keeps its own calculator state (`calculatorDisplay`, `calculatorMemory`, …) and drag positioning (`calculatorPosition`, `isDragging`); expanding/collapsing and mouse-drag move a floating panel.
- **Fonts:** On mount, `Sphere.jsx` injects a `<style>` with `@font-face` for Proxima Nova and polls `document.fonts` to toggle a `.font-loaded` class on title elements.

The file is very large (~2000+ lines); refactors would split SVG primitives, formula helpers, and the custom-shape wizard into separate modules.

---

## Product integration

- **CK-12 Intent Response** — production / master: pending  
- **CK-12 Flexbooks** — book/lesson link: pending  

`package.json` `repository` / `homepage` may point at other GitHub users; treat [content-interactives.github.io/you-try-surface-area-/](https://content-interactives.github.io/you-try-surface-area-/) as the canonical **CK-12 Content Interactives** deployment unless your fork differs.

---

## Educational alignment

Topic and standards placeholders live in [`Standards.md`](Standards.md); fill in CCSS (e.g. **7.G.B.6**) there to match your curriculum mapping.
