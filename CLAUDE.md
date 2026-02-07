# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AKSMED is a web-based interactive logo preview and typography editor for a luxury medical/clinic brand. It's a single-page application with no build tooling—edit files directly and preview in browser.

## Development Commands

```bash
# Start local development server (serves on http://localhost:8080)
node server.js

# Or with custom port
PORT=3000 node server.js
```

No npm, no build step, no tests—just edit and refresh.

## Architecture

**Single-file SPA**: All application code lives in `index.html` (~1100 lines) with embedded CSS and JavaScript. No frameworks—vanilla JS with direct DOM manipulation.

**Logo Assets**:
- `logo-symbol.svg` - Core reusable logo symbol
- `logo-editable.svg` - Vertical layout template
- `vendor/aksmed-vendor-portrait.svg` - Portrait lockup for export
- `vendor/aksmed-vendor-landscape.svg` - Landscape lockup for export

**Key Features in index.html**:
- Typography controls: 60+ Google Fonts, size/weight/spacing, italic/small-caps
- Paint modes: Solid color or Gold material shader (uses SVG filters with specular lighting)
- Export: Portrait and landscape SVG with current settings baked in
- Real-time preview with brand color synchronization

## SVG Manipulation Patterns

The app dynamically modifies SVG content loaded via fetch:
1. Loads template SVG from vendor/ directory
2. Updates text elements, colors, and transforms based on UI controls
3. Applies gold material filter when selected (feSpecularLighting, feGaussianBlur, feMerge)
4. Exports modified SVG as downloadable file

When editing SVG templates, preserve `id` attributes used for JavaScript targeting.

## Code Organization

`index.html` contains three sections:
1. **CSS** (`<style>`): Dark theme, control panel layout, responsive design
2. **HTML**: Preview container, control panel with inputs/selectors
3. **JavaScript** (`<script>`): Event handlers, SVG manipulation, export functions

`server.js`: Minimal Node.js HTTP server with no-cache headers and MIME type handling.
