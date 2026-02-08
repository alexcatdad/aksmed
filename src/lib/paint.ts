import { ensureGoldDefs } from "./gold-filter";
import { recolorSvgNode } from "./svg-utils";

interface PaintConfig {
	isGold: boolean;
	lightness: number;
	darkness: number;
}

export function applyPaintToNode(
	svgRoot: SVGSVGElement,
	node: Element,
	color: string,
	paint: PaintConfig,
): void {
	if (paint.isGold) {
		ensureGoldDefs(svgRoot, paint.lightness, paint.darkness);
		recolorSvgNode(node, "#B8860B");
		node.setAttribute("filter", "url(#gold-metal-filter)");
		return;
	}
	recolorSvgNode(node, color);
	node.removeAttribute("filter");
}

export function applyPaintToText(
	svgRoot: SVGSVGElement,
	textNode: Element,
	color: string,
	strokeThicknessPct: number,
	strokeWidthPx: number,
	paint: PaintConfig,
): void {
	if (paint.isGold) {
		ensureGoldDefs(svgRoot, paint.lightness, paint.darkness);
	}
	const fillPaint = paint.isGold ? "#B8860B" : color;
	const strokePaint = paint.isGold ? "#8B6914" : color;

	textNode.setAttribute("fill", fillPaint);
	if (strokeThicknessPct > 0) {
		textNode.setAttribute("stroke", strokePaint);
		textNode.setAttribute("stroke-width", String(strokeWidthPx));
		textNode.setAttribute("paint-order", "stroke fill");
		textNode.setAttribute("stroke-linejoin", "round");
		textNode.setAttribute("stroke-linecap", "round");
	} else {
		textNode.removeAttribute("stroke");
		textNode.removeAttribute("stroke-width");
		textNode.removeAttribute("paint-order");
		textNode.removeAttribute("stroke-linejoin");
		textNode.removeAttribute("stroke-linecap");
	}

	if (paint.isGold) {
		textNode.setAttribute("filter", "url(#gold-metal-filter)");
	} else {
		textNode.removeAttribute("filter");
	}
}
