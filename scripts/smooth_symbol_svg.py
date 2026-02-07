#!/usr/bin/env python3
from pathlib import Path
from typing import List, Optional, Tuple

import numpy as np
from PIL import Image
from scipy.ndimage import convolve, distance_transform_edt, gaussian_filter, gaussian_filter1d
from skimage import measure, morphology

ROOT = Path(__file__).resolve().parents[1]
MASK_PATH = ROOT / "logo-mask.png"

# Tuned for cleaner curves from raster mask while preserving shape.
UPSCALE = 3
BLUR_SIGMA = 1.25
CONTOUR_SMOOTH_SIGMA = 1.8
SIMPLIFY_TOLERANCE = 1.15
MIN_AREA = 25
HANDLE_CLAMP_RATIO = 0.42
SHARP_CORNER_COS = 0.40
SHARP_TENSION = 0.12
THICKNESS_SCALE = 0.85
THICKNESS_MIN = 2
THICKNESS_MAX = 4
END_CAP_EXTRA = 1.25


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

        seg = p2 - p1
        seg_len = np.linalg.norm(seg)
        if seg_len < 1e-9:
            continue

        cp1 = p1 + (p2 - p0) / 6.0
        cp2 = p2 - (p3 - p1) / 6.0

        # Clamp handle lengths to avoid overshoot/kinks at line-curve transitions.
        handle_limit = HANDLE_CLAMP_RATIO * seg_len
        h1 = cp1 - p1
        h2 = cp2 - p2
        h1_len = np.linalg.norm(h1)
        h2_len = np.linalg.norm(h2)
        if h1_len > handle_limit and h1_len > 1e-9:
            cp1 = p1 + h1 * (handle_limit / h1_len)
        if h2_len > handle_limit and h2_len > 1e-9:
            cp2 = p2 + h2 * (handle_limit / h2_len)

        # Reduce tangents around sharp corners to keep joins cleaner.
        v_in_1 = p1 - p0
        v_out_1 = p2 - p1
        l_in_1 = np.linalg.norm(v_in_1)
        l_out_1 = np.linalg.norm(v_out_1)
        if l_in_1 > 1e-9 and l_out_1 > 1e-9:
            cos_1 = float(np.dot(v_in_1, v_out_1) / (l_in_1 * l_out_1))
            if cos_1 < SHARP_CORNER_COS:
                cp1 = p1 + v_out_1 * SHARP_TENSION

        v_in_2 = p2 - p1
        v_out_2 = p3 - p2
        l_in_2 = np.linalg.norm(v_in_2)
        l_out_2 = np.linalg.norm(v_out_2)
        if l_in_2 > 1e-9 and l_out_2 > 1e-9:
            cos_2 = float(np.dot(v_in_2, v_out_2) / (l_in_2 * l_out_2))
            if cos_2 < SHARP_CORNER_COS:
                cp2 = p2 - v_in_2 * SHARP_TENSION

        d.append(
            f"C {cp1[0]:.2f} {cp1[1]:.2f} "
            f"{cp2[0]:.2f} {cp2[1]:.2f} "
            f"{p2[0]:.2f} {p2[1]:.2f}"
        )
    d.append("Z")
    return " ".join(d)


def load_mask(path: Path) -> np.ndarray:
    return np.array(Image.open(path).convert("L")) > 127


def _neighbors8(skel: np.ndarray, y: int, x: int, prev: Optional[Tuple[int, int]]) -> List[Tuple[int, int]]:
    h, w = skel.shape
    out: List[Tuple[int, int]] = []
    for yy in range(max(0, y - 1), min(h, y + 2)):
        for xx in range(max(0, x - 1), min(w, x + 2)):
            if yy == y and xx == x:
                continue
            if prev is not None and (yy, xx) == prev:
                continue
            if skel[yy, xx]:
                out.append((yy, xx))
    return out


def _estimate_tangent(skel: np.ndarray, start: Tuple[int, int], steps: int = 10) -> Optional[np.ndarray]:
    y, x = start
    current = (y, x)
    prev: Optional[Tuple[int, int]] = None
    for _ in range(steps):
        nxt = _neighbors8(skel, current[0], current[1], prev)
        if not nxt:
            break
        if len(nxt) == 1:
            chosen = nxt[0]
        else:
            # Prefer continuing away from the start point.
            sy, sx = start
            chosen = max(nxt, key=lambda p: (p[0] - sy) ** 2 + (p[1] - sx) ** 2)
        prev, current = current, chosen

    dy = float(current[0] - y)
    dx = float(current[1] - x)
    norm = np.hypot(dy, dx)
    if norm < 1e-9:
        return None
    return np.array([dy / norm, dx / norm], dtype=float)


def _flatten_end_caps(mask: np.ndarray, skeleton: np.ndarray, half_w: int) -> np.ndarray:
    # Turn rounded half-disks at open ends into flatter caps for more uniform
    # perceived thickness where lines terminate.
    n = convolve(skeleton.astype(np.int32), np.ones((3, 3), dtype=np.int32), mode="constant", cval=0)
    neighbor_count = n - skeleton.astype(np.int32)
    endpoints = np.argwhere(skeleton & (neighbor_count == 1))

    out = mask.copy()
    rad = int(np.ceil(half_w + END_CAP_EXTRA))
    if rad < 1:
        return out

    h, w = mask.shape
    for y0, x0 in endpoints:
        t = _estimate_tangent(skeleton, (int(y0), int(x0)))
        if t is None:
            continue

        y_min = max(0, y0 - rad)
        y_max = min(h, y0 + rad + 1)
        x_min = max(0, x0 - rad)
        x_max = min(w, x0 + rad + 1)

        yy, xx = np.mgrid[y_min:y_max, x_min:x_max]
        vy = yy - y0
        vx = xx - x0
        dot = vy * t[0] + vx * t[1]
        dist = np.hypot(vy, vx)

        # Remove only the forward half of the local cap.
        cut = (dot > 0) & (dist <= (half_w + END_CAP_EXTRA))
        out[y_min:y_max, x_min:x_max] &= ~cut

    return out


def normalize_line_thickness(mask: np.ndarray) -> np.ndarray:
    # Convert varying-width glow traces to a stable-width binary shape:
    # 1) centerline extraction, 2) fixed-radius redraw.
    skel = morphology.skeletonize(mask)
    dist = distance_transform_edt(mask)
    widths = dist[skel]
    if widths.size == 0:
        return mask

    half_w = int(
        np.clip(
            np.floor(float(np.median(widths)) * THICKNESS_SCALE),
            THICKNESS_MIN,
            THICKNESS_MAX,
        )
    )
    normalized = morphology.binary_dilation(skel, morphology.disk(half_w))
    normalized = _flatten_end_caps(normalized, skel, half_w)
    normalized = morphology.binary_opening(normalized, morphology.disk(1))
    normalized = morphology.binary_closing(normalized, morphology.disk(1))
    normalized = morphology.remove_small_holes(normalized, area_threshold=24)
    normalized = morphology.remove_small_objects(normalized, min_size=24)
    return normalized


def extract_smoothed_paths(mask: np.ndarray) -> list[str]:
    mask = normalize_line_thickness(mask)
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
