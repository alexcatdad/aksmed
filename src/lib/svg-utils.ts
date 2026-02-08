import type { ViewBox } from "../types";

export function parseViewBox(svg: SVGSVGElement): ViewBox {
	const vb = svg.getAttribute("viewBox");
	if (!vb) return { x: 0, y: 0, width: 1, height: 1 };
	const p = vb.trim().split(/\s+/).map(Number);
	if (p.length !== 4 || p.some((n) => Number.isNaN(n))) {
		return { x: 0, y: 0, width: 1, height: 1 };
	}
	return { x: p[0], y: p[1], width: p[2], height: p[3] };
}

export function recolorSvgNode(node: Element, color: string): void {
	const ownFill = node.getAttribute("fill");
	if (ownFill && ownFill.toLowerCase() !== "none") {
		node.setAttribute("fill", color);
	}
	const filled = node.querySelectorAll("[fill]");
	for (const el of filled) {
		const fill = el.getAttribute("fill");
		if (fill && fill.toLowerCase() !== "none") {
			el.setAttribute("fill", color);
		}
	}
	const stroked = node.querySelectorAll("[stroke]");
	for (const el of stroked) {
		const stroke = el.getAttribute("stroke");
		if (stroke && stroke.toLowerCase() !== "none") {
			el.setAttribute("stroke", color);
		}
	}
}

export function parseSvg(svgText: string): SVGSVGElement {
	const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
	const svg = doc.documentElement as unknown as SVGSVGElement;
	svg.setAttribute("width", "100%");
	svg.setAttribute("height", "100%");
	svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
	return svg;
}

export async function fetchSvg(path: string): Promise<string> {
	const v = Date.now();
	const res = await fetch(`${path}?v=${v}`, { cache: "no-store" });
	if (!res.ok) throw new Error(`${path} HTTP ${res.status}`);
	return res.text();
}
