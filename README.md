# AKSMED Logo Preview

A browser-based design studio for previewing and refining the AKSMED luxury medical brand logo lockups before vectorizing for print.

![Preview](https://img.shields.io/badge/status-active-gold)

## Features

- **Portrait & Landscape Lockups** - Preview both vertical (stacked) and horizontal logo arrangements
- **Real-time Typography Controls** - Adjust font size, tracking (letter-spacing), leading, weight, and stroke
- **Metallic Gold Effect** - SVG filter-based realistic gold rendering with adjustable shine and depth
- **URL State Persistence** - All settings saved in URL params for easy sharing and bookmarking
- **Version History** - Save snapshots and traverse between versions (stored in localStorage)
- **SVG Export** - Download production-ready SVG files with proper viewBox calculations

## Quick Start

```bash
# Clone the repository
git clone https://github.com/alexcatdad/aksmed.git
cd aksmed

# Serve locally (any static server works)
python3 -m http.server 8080
# or
npx serve .
```

Open http://localhost:8080 in your browser.

## Controls

### Portrait Mode
| Control | Range | Description |
|---------|-------|-------------|
| Line 1 Size | 48-220px | Font size for first line |
| Line 2 Size | 48-220px | Font size for second line |
| Line 1 Tracking | -2 to 80px | Letter spacing for first line |
| Line 2 Tracking | -2 to 80px | Letter spacing for second line |
| Leading | 0.7-1.6 | Line spacing multiplier |
| Weight | 300-700 | Font weight |
| Stroke | 0-3% | Outline thickness |
| Symbol Scale | 20-180% | Logo symbol size |

### Style Options
- **Solid Color** - Single brand color
- **Metallic Gold** - Realistic gold with specular lighting
  - Shine: Controls highlight intensity
  - Depth: Controls shadow depth

### Version History
- **Save** - Snapshot current settings
- **←/→** - Navigate between saved versions
- **Clear** - Remove all saved versions

## URL Parameters

Settings are encoded in short URL params for sharing:

| Param | Control |
|-------|---------|
| `l1s` | Line 1 size |
| `l2s` | Line 2 size |
| `l1ls` | Line 1 tracking |
| `l2ls` | Line 2 tracking |
| `lns` | Line spacing |
| `fw` | Font weight |
| `st` | Stroke thickness |
| `sc` | Symbol scale |
| `pm` | Paint mode (solid/gold) |
| `gl` | Gold lightness |
| `gd` | Gold depth |

Example: `?l1s=196&l2s=116&l1ls=25&l2ls=50&pm=gold`

## Tech Stack

- Vanilla HTML/CSS/JS (no build step)
- Google Fonts (Cormorant Garamond, Instrument Sans)
- SVG filters for metallic effects
- localStorage for version history

## License

Private - AKSMED brand assets
