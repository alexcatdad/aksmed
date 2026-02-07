#!/usr/bin/env python3
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, gaussian_filter1d
from skimage import measure

ROOT = Path(__file__).resolve().parents[1]
MASK_PATH = ROOT / "logo-mask.png"

# Tuned for cleaner curves from raster mask while preserving shape.
UPSCALE = 3
BLUR_SIGMA = 1.25
CONTOUR_SMOOTH_SIGMA = 1.8
SIMPLIFY_TOLERANCE = 1.0
MIN_AREA = 25


def polygon_area(pts: np.ndarray) -> float:
    x = pts[:, 0]
    y = pts[:, 1]
    return 0.5 * abs(np.dot(x, np.roll(y, -1)) - np.dot(y, np.roll(x, -1)))


def catmull_rom_to_bezier(points: np.ndarray) -> str:
    n = len(points)
    if n < 3:
        return ""
    d = [f"M {points[0,0]:.2f} {points[0,1]:.2f}"]
    for i in range(n):
        p0 = points[(i - 1) % n].astype(float)
        p1 = points[i].astype(float)
        p2 = points[(i + 1) % n].astype(float)
        p3 = points[(i + 2) % n].astype(float)

        cp1 = p1 + (p2 - p0) / 6.0
        cp2 = p2 - (p3 - p1) / 6.0
        d.append(
            f"C {cp1[0]:.2f} {cp1[1]:.2f} "
            f"{cp2[0]:.2f} {cp2[1]:.2f} "
            f"{p2[0]:.2f} {p2[1]:.2f}"
        )
    d.append("Z")
    return " ".join(d)


def load_mask(path: Path) -> np.ndarray:
    return np.array(Image.open(path).convert("L")) > 127


def extract_smoothed_paths(mask: np.ndarray) -> list[str]:
    h, w = mask.shape
    up = (
        Image.fromarray((mask.astype(np.uint8) * 255), mode="L")
        .resize((w * UPSCALE, h * UPSCALE), Image.Resampling.BICUBIC)
    )
    arr = np.array(up, dtype=np.float32) / 255.0
    arr = gaussian_filter(arr, sigma=BLUR_SIGMA)

    contours = measure.find_contours(arr, 0.5)

    result: list[tuple[float, str]] = []
    for contour in contours:
        xy = np.column_stack((contour[:, 1] / UPSCALE, contour[:, 0] / UPSCALE))
        if len(xy) < 30:
            continue

        x = gaussian_filter1d(xy[:, 0], sigma=CONTOUR_SMOOTH_SIGMA, mode="wrap")
        y = gaussian_filter1d(xy[:, 1], sigma=CONTOUR_SMOOTH_SIGMA, mode="wrap")
        sm = np.column_stack((x, y))

        # simplify while preserving overall smooth geometry
        simp = measure.approximate_polygon(
            np.column_stack((sm[:, 1], sm[:, 0])),
            tolerance=SIMPLIFY_TOLERANCE,
        )
        pts = np.column_stack((simp[:, 1], simp[:, 0]))
        if len(pts) > 1 and np.allclose(pts[0], pts[-1]):
            pts = pts[:-1]
        if len(pts) < 8:
            continue

        area = polygon_area(pts)
        if area < MIN_AREA:
            continue

        d = catmull_rom_to_bezier(pts)
        if d:
            result.append((area, d))

    # deterministic order
    result.sort(key=lambda x: x[0], reverse=True)
    return [d for _, d in result]


def write_symbol_svgs(paths: list[str], width: int, height: int) -> None:
    outputs = {
        "logo-symbol.svg": "black",
        "logo-vector.svg": "#111111",
        "logo-laser.svg": "black",
    }
    for name, fill in outputs.items():
        out = ROOT / name
        with out.open("w", encoding="utf-8") as f:
            f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
            f.write(
                f'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 {width} {height}">\n'
            )
            f.write(f'  <g fill="{fill}" fill-rule="evenodd" stroke="none">\n')
            for d in paths:
                f.write(f'    <path d="{d}"/>\n')
            f.write("  </g>\n")
            f.write("</svg>\n")


def write_editable_svg(paths: list[str], width: int, height: int) -> None:
    text_area = max(220, int(width * 0.38))
    full_h = height + text_area
    xmid = width / 2
    line1_y = height + int(text_area * 0.38)
    line2_y = height + int(text_area * 0.74)
    font_size = max(56, int(width * 0.14))

    out = ROOT / "logo-editable.svg"
    with out.open("w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write(
            f'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 {width} {full_h}">\n'
        )
        f.write('  <g fill="black" fill-rule="evenodd" stroke="none">\n')
        for d in paths:
            f.write(f'    <path d="{d}"/>\n')
        f.write("  </g>\n")
        f.write(
            f'  <text id="line1" x="{xmid:.2f}" y="{line1_y}" text-anchor="middle" '
            f'font-family="Arial, Helvetica, sans-serif" font-size="{font_size}" '
            f'font-weight="700" letter-spacing="2">AKSMED</text>\n'
        )
        f.write(
            f'  <text id="line2" x="{xmid:.2f}" y="{line2_y}" text-anchor="middle" '
            f'font-family="Arial, Helvetica, sans-serif" font-size="{font_size}" '
            f'font-weight="700" letter-spacing="2">CLINIQUE</text>\n'
        )
        f.write("</svg>\n")


def main() -> None:
    mask = load_mask(MASK_PATH)
    h, w = mask.shape
    paths = extract_smoothed_paths(mask)

    write_symbol_svgs(paths, w, h)
    write_editable_svg(paths, w, h)

    print(f"Generated smoothed logo from {MASK_PATH.name}")
    print(f"Dimensions: {w} x {h}")
    print(f"Paths: {len(paths)}")


if __name__ == "__main__":
    main()
