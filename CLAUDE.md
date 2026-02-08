# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AKSMED is a web-based interactive logo preview and typography editor for a luxury medical/clinic brand. React SPA with URL state management via nuqs, deployed to GitHub Pages.

## Development Commands

```bash
# Install dependencies
bun install

# Start dev server (serves on http://localhost:5173)
bun run dev

# Production build
bun run build

# Preview production build at /aksmed/ base
bun run preview

# Lint/format
bun run check
bun run format
```

## Tech Stack

- **Build**: Vite + Bun
- **Framework**: React 19 + TypeScript (strict)
- **URL State**: nuqs with NuqsAdapter (React SPA mode, not Next.js)
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite)
- **Linting**: Biome
- **Deploy**: GitHub Actions → GitHub Pages (artifact-based)

## Architecture

```
src/
├── main.tsx                    # NuqsAdapter wrapper + entry
├── App.tsx                     # Layout shell, wires hooks to components
├── index.css                   # Tailwind v4 @theme tokens + base styles
├── constants/
│   ├── fonts.ts                # 60+ FONT_OPTIONS array
│   └── defaults.ts             # Default values for all URL params
├── hooks/
│   ├── usePortraitParams.ts    # 13 portrait URL params via nuqs
│   ├── useHorizontalParams.ts  # 10 horizontal URL params via nuqs
│   ├── usePaintParams.ts       # 4 paint URL params via nuqs
│   ├── useSvgLoader.ts         # Fetch + parse SVG templates
│   ├── useGoogleFont.ts        # Dynamic Google Font loading
│   └── useVersionHistory.ts    # localStorage snapshots
├── lib/
│   ├── svg-utils.ts            # parseViewBox, recolorSvgNode, parseSvg, fetchSvg
│   ├── gold-filter.ts          # ensureGoldDefs (SVG filter chain)
│   ├── paint.ts                # applyPaintToNode/Text
│   └── export.ts               # downloadSvg
├── components/
│   ├── Header.tsx
│   ├── Toolbar.tsx             # Paint mode + gold sliders + brand color
│   ├── VersionBar.tsx          # Save/prev/next/clear version history
│   ├── PortraitCard.tsx        # Controls + preview + export
│   ├── PortraitPreview.tsx     # Imperative SVG DOM manipulation via useRef+useEffect
│   ├── PortraitControls.tsx    # 13 inputs
│   ├── LandscapeCard.tsx       # Controls + preview + export
│   ├── LandscapePreview.tsx    # Builds horizontal SVG from scratch
│   ├── LandscapeControls.tsx   # 10 inputs
│   ├── ReferenceCard.tsx       # Static logo.png
│   └── ui/
│       ├── RangeSlider.tsx
│       ├── FontPicker.tsx
│       └── ToggleCheckbox.tsx
└── types/index.ts
```

**Logo Assets** (in `public/`):
- `logo-symbol.svg` — Core reusable logo symbol
- `logo-editable.svg` — Vertical layout template
- `vendor/aksmed-vendor-portrait.svg` — Portrait lockup for export
- `vendor/aksmed-vendor-landscape.svg` — Landscape lockup for export

## SVG Manipulation Patterns

Preview components use `useRef` + `useEffect` for imperative SVG DOM manipulation (not JSX). The gold filter, paint functions, and export logic are pure utility functions in `lib/`. This is intentional — the SVG filter chain is too complex for declarative JSX and must be preserved exactly.

Asset fetches use `import.meta.env.BASE_URL` prefix for correct paths under `/aksmed/` base.

When editing SVG templates, preserve `id` attributes (`#line1`, `#line2`, `#logo-symbol-wrapper`) used for JavaScript targeting.

## URL State Design

Three `useQueryStates` groups (all `{ history: 'replace' }`):

- **Portrait (13 params)**: l1, l2, f, l1s, l2s, l1ls, l2ls, lns, fw, st, sc, it, smc
- **Horizontal (10 params)**: ht, hf, hfs, hls, hfw, hst, hsc, hg, hit, hsmc
- **Paint (4 params)**: pm, gl, gd, bc

nuqs auto-omits params at default values, keeping URLs clean.

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) builds with Bun and deploys to GitHub Pages using artifact-based deployment. Requires "GitHub Pages > Source: GitHub Actions" enabled in repo settings.

Vite base path is set to `/aksmed/` in `vite.config.ts`.
