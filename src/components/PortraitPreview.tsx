import { useEffect, useRef } from "react";
import { applyPaintToNode, applyPaintToText } from "../lib/paint";
import { parseViewBox } from "../lib/svg-utils";
import { cm, pct } from "../lib/units";
import type { PaintParams, PortraitParams } from "../types";

interface PortraitPreviewProps {
	symbolSvg: SVGSVGElement | null;
	portrait: PortraitParams;
	paint: PaintParams;
	svgRef: React.RefObject<SVGSVGElement | null>;
}

const NS = "http://www.w3.org/2000/svg";

export function PortraitPreview({ symbolSvg, portrait, paint, svgRef }: PortraitPreviewProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!symbolSvg || !containerRef.current) return;

		const isGold = paint.pm === "gold";
		const brandColor = paint.bc;
		const lightness = Math.max(0, Math.min(100, paint.gl));
		const darkness = Math.max(0, Math.min(100, paint.gd));
		const paintConfig = { isGold, lightness, darkness };

		const canvasW = cm(portrait.pw);
		const canvasH = cm(portrait.ph);

		// Convert % params to SVG units
		const fontSize1 = pct(portrait.l1s, canvasW);
		const fontSize2 = pct(portrait.l2s, canvasW);
		const letterSpacing1 = pct(portrait.l1ls, canvasW);
		const letterSpacing2 = pct(portrait.l2ls, canvasW);
		const symbolSize = pct(portrait.sc, canvasW);
		const strokeWidth1 = (fontSize1 * portrait.st) / 100;
		const strokeWidth2 = (fontSize2 * portrait.st) / 100;

		// Create fresh SVG
		const svg = document.createElementNS(NS, "svg") as SVGSVGElement;
		svg.setAttribute("xmlns", NS);
		svg.setAttribute("viewBox", `0 0 ${canvasW} ${canvasH}`);
		svg.setAttribute("width", "100%");
		svg.setAttribute("height", "100%");
		svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

		// --- Symbol ---
		const base = symbolSvg;
		const vb = parseViewBox(base);
		const symbolScale = symbolSize / Math.max(1, vb.width);
		const symbolW = vb.width * symbolScale;
		const symbolH = vb.height * symbolScale;

		// Text zone starts at ty% of canvas height
		const textZoneY = (portrait.ty / 100) * canvasH;
		// Symbol centered horizontally, centered vertically in space above text
		const symbolX = (canvasW - symbolW) / 2;
		const symbolY = (textZoneY - symbolH) / 2;

		const symbolGroup = document.createElementNS(NS, "g") as SVGGElement;
		symbolGroup.setAttribute(
			"transform",
			`translate(${symbolX - vb.x * symbolScale}, ${symbolY - vb.y * symbolScale}) scale(${symbolScale})`,
		);
		for (const child of Array.from(base.children)) {
			symbolGroup.appendChild(child.cloneNode(true));
		}
		applyPaintToNode(svg, symbolGroup, brandColor, paintConfig);
		svg.appendChild(symbolGroup);

		// --- Text ---
		const centerX = canvasW / 2;
		const y1 = textZoneY;
		const y2 = y1 + fontSize2 * portrait.lns;

		const t1 = document.createElementNS(NS, "text");
		t1.textContent = portrait.l1 || " ";
		t1.setAttribute("x", String(centerX));
		t1.setAttribute("y", String(y1));
		t1.setAttribute("text-anchor", "middle");
		t1.setAttribute("font-family", portrait.f);
		t1.setAttribute("font-size", String(fontSize1));
		t1.setAttribute("letter-spacing", String(letterSpacing1));
		t1.setAttribute("font-weight", String(portrait.fw));
		t1.setAttribute("font-style", portrait.it ? "italic" : "normal");
		t1.setAttribute("font-variant", portrait.smc ? "small-caps" : "normal");
		applyPaintToText(svg, t1, brandColor, portrait.st, strokeWidth1, paintConfig);
		svg.appendChild(t1);

		const t2 = document.createElementNS(NS, "text");
		t2.textContent = portrait.l2 || " ";
		t2.setAttribute("x", String(centerX));
		t2.setAttribute("y", String(y2));
		t2.setAttribute("text-anchor", "middle");
		t2.setAttribute("font-family", portrait.f);
		t2.setAttribute("font-size", String(fontSize2));
		t2.setAttribute("letter-spacing", String(letterSpacing2));
		t2.setAttribute("font-weight", String(portrait.fw));
		t2.setAttribute("font-style", portrait.it ? "italic" : "normal");
		t2.setAttribute("font-variant", portrait.smc ? "small-caps" : "normal");
		applyPaintToText(svg, t2, brandColor, portrait.st, strokeWidth2, paintConfig);
		svg.appendChild(t2);

		containerRef.current.replaceChildren(svg);
		svgRef.current = svg;
	}, [symbolSvg, portrait, paint, svgRef]);

	return (
		<div
			className="portrait-preview relative bg-white rounded-lg overflow-hidden frame w-full"
			style={{ aspectRatio: `${portrait.pw} / ${portrait.ph}` }}
		>
			<span className="frame-marks" />
			<div
				ref={containerRef}
				className="absolute inset-0 flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:block"
			/>
		</div>
	);
}
