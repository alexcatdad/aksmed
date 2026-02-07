#!/usr/bin/env python3
from __future__ import annotations

from math import cos, radians, sin
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

WIDTH = 780
HEIGHT = 794
CX = WIDTH / 2
CY = HEIGHT / 2

BASE_ANGLE_DEG = 45.0
ROTATIONS = (0.0, 90.0, 180.0, 270.0)

LANE_OFFSETS = (-22.5, -7.5, 7.5, 22.5)
RING_RADII = (272.0, 289.0, 306.0, 323.0)

STROKE_WIDTH = 7.0

# Single rounded-"D" centerline in local (u, v) coordinates.
# u is outward along motif axis, v is perpendicular to it.
MOTIF_POINTS = {
    "p0": (18.0, -74.0),
    "c1": (90.0, -114.0),
    "c2": (184.0, -76.0),
    "p1": (224.0, 0.0),
    "c3": (255.0, 69.0),
    "c4": (206.0, 157.0),
    "p2": (110.0, 173.0),
    "c5": (44.0, 172.0),
    "c6": (12.0, 131.0),
    "p3": (10.0, 70.0),
}


def uv_to_xy(u: float, v: float, angle_deg: float) -> tuple[float, float]:
    a = radians(angle_deg)
    ex, ey = cos(a), sin(a)
    px, py = -sin(a), cos(a)
    x = CX + u * ex + v * px
    y = CY + u * ey + v * py
    return x, y


def motif_lane_path(angle_deg: float, lane_offset: float) -> str:
    p0 = uv_to_xy(*_with_offset(MOTIF_POINTS["p0"], lane_offset), angle_deg)
    c1 = uv_to_xy(*_with_offset(MOTIF_POINTS["c1"], lane_offset), angle_deg)
    c2 = uv_to_xy(*_with_offset(MOTIF_POINTS["c2"], lane_offset), angle_deg)
    p1 = uv_to_xy(*_with_offset(MOTIF_POINTS["p1"], lane_offset), angle_deg)
    c3 = uv_to_xy(*_with_offset(MOTIF_POINTS["c3"], lane_offset), angle_deg)
    c4 = uv_to_xy(*_with_offset(MOTIF_POINTS["c4"], lane_offset), angle_deg)
    p2 = uv_to_xy(*_with_offset(MOTIF_POINTS["p2"], lane_offset), angle_deg)
    c5 = uv_to_xy(*_with_offset(MOTIF_POINTS["c5"], lane_offset), angle_deg)
    c6 = uv_to_xy(*_with_offset(MOTIF_POINTS["c6"], lane_offset), angle_deg)
    p3 = uv_to_xy(*_with_offset(MOTIF_POINTS["p3"], lane_offset), angle_deg)
    return (
        f"M {p0[0]:.2f} {p0[1]:.2f} "
        f"C {c1[0]:.2f} {c1[1]:.2f} {c2[0]:.2f} {c2[1]:.2f} {p1[0]:.2f} {p1[1]:.2f} "
        f"C {c3[0]:.2f} {c3[1]:.2f} {c4[0]:.2f} {c4[1]:.2f} {p2[0]:.2f} {p2[1]:.2f} "
        f"C {c5[0]:.2f} {c5[1]:.2f} {c6[0]:.2f} {c6[1]:.2f} {p3[0]:.2f} {p3[1]:.2f}"
    )


def _with_offset(p: tuple[float, float], lane_offset: float) -> tuple[float, float]:
    return p[0], p[1] + lane_offset


def circle_path(radius: float) -> str:
    x0 = CX + radius
    return (
        f"M {x0:.2f} {CY:.2f} "
        f"A {radius:.2f} {radius:.2f} 0 1 1 {CX - radius:.2f} {CY:.2f} "
        f"A {radius:.2f} {radius:.2f} 0 1 1 {x0:.2f} {CY:.2f}"
    )


def build_paths() -> list[str]:
    paths: list[str] = []

    for rot in ROTATIONS:
        angle = BASE_ANGLE_DEG + rot
        for lane_offset in LANE_OFFSETS:
            paths.append(motif_lane_path(angle, lane_offset))

    for radius in RING_RADII:
        paths.append(circle_path(radius))

    return paths


def write_symbol_svgs(paths: list[str]) -> None:
    outputs = {
        "logo-symbol.svg": "black",
        "logo-vector.svg": "#111111",
        "logo-laser.svg": "black",
    }

    for name, stroke in outputs.items():
        out = ROOT / name
        with out.open("w", encoding="utf-8") as f:
            f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
            f.write(
                f'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 {WIDTH} {HEIGHT}">\n'
            )
            f.write(
                f'  <g fill="none" stroke="{stroke}" stroke-width="{STROKE_WIDTH:.2f}" '
                'stroke-linecap="round" stroke-linejoin="round">\n'
            )
            for d in paths:
                f.write(f'    <path d="{d}"/>\n')
            f.write("  </g>\n")
            f.write("</svg>\n")


def write_editable_svg(paths: list[str]) -> None:
    text_area = max(220, int(WIDTH * 0.38))
    full_h = HEIGHT + text_area
    xmid = WIDTH / 2
    line1_y = HEIGHT + int(text_area * 0.38)
    line2_y = HEIGHT + int(text_area * 0.74)
    font_size = max(56, int(WIDTH * 0.14))

    out = ROOT / "logo-editable.svg"
    with out.open("w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write(
            f'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 {WIDTH} {full_h}">\n'
        )
        f.write(
            f'  <g fill="none" stroke="black" stroke-width="{STROKE_WIDTH:.2f}" '
            'stroke-linecap="round" stroke-linejoin="round">\n'
        )
        for d in paths:
            f.write(f'    <path d="{d}"/>\n')
        f.write("  </g>\n")
        f.write(
            f'  <text id="line1" x="{xmid:.2f}" y="{line1_y}" text-anchor="middle" '
            f'font-family="Arial, Helvetica, sans-serif" font-size="{font_size}" '
            'font-weight="700" letter-spacing="2">AKSMED</text>\n'
        )
        f.write(
            f'  <text id="line2" x="{xmid:.2f}" y="{line2_y}" text-anchor="middle" '
            f'font-family="Arial, Helvetica, sans-serif" font-size="{font_size}" '
            'font-weight="700" letter-spacing="2">CLINIQUE</text>\n'
        )
        f.write("</svg>\n")


def main() -> None:
    paths = build_paths()
    write_symbol_svgs(paths)
    write_editable_svg(paths)
    print("Generated motif-based logo geometry")
    print(f"Paths: {len(paths)}")


if __name__ == "__main__":
    main()
