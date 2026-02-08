import { useEffect, useRef } from "react";
import { applyPaintToNode, applyPaintToText } from "../lib/paint";
import { parseViewBox } from "../lib/svg-utils";
import { cm, pct } from "../lib/units";
import type { HorizontalParams, PaintParams } from "../types";

interface LandscapePreviewProps {
	symbolSvg: SVGSVGElement | null;
	horizontal: HorizontalParams;
	paint: PaintParams;
	svgRef: React.RefObject<SVGSVGElement | null>;
}

const NS = "http://www.w3.org/2000/svg";

export function LandscapePreview({ symbolSvg, horizontal, paint, svgRef }: LandscapePreviewProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!symbolSvg || !containerRef.current) return;

		const isGold = paint.pm === "gold";
		const brandColor = paint.bc;
		const lightness = Math.max(0, Math.min(100, paint.gl));
		const darkness = Math.max(0, Math.min(100, paint.gd));
		const paintConfig = { isGold, lightness, darkness };

		const canvasW = cm(horizontal.hw);
		const canvasH = cm(horizontal.hh);

		// Convert % params to SVG units
		const fontSize = pct(horizontal.hfs, canvasW);
		const letterSpacing = pct(horizontal.hls, canvasW);
		const symbolSize = pct(horizontal.hsc, canvasW);
		const gap = pct(horizontal.hg, canvasW);
		const strokeWidthPx = (fontSize * horizontal.hst) / 100;

		const base = symbolSvg;
		const vb = parseViewBox(base);
		const symbolScale = symbolSize / Math.max(1, vb.width);
		const symbolW = vb.width * symbolScale;
		const symbolH = vb.height * symbolScale;

		// Create fixed-size SVG from cm dimensions
		const svg = document.createElementNS(NS, "svg") as SVGSVGElement;
		svg.setAttribute("xmlns", NS);
		svg.setAttribute("viewBox", `0 0 ${canvasW} ${canvasH}`);
		svg.setAttribute("width", "100%");
		svg.setAttribute("height", "100%");
		svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

		// Build content group — we'll center it after measuring
		const contentGroup = document.createElementNS(NS, "g") as SVGGElement;

		// Symbol at x=0, vertically centered
		const symbolGroup = document.createElementNS(NS, "g") as SVGGElement;
		symbolGroup.setAttribute(
			"transform",
			`translate(${-vb.x * symbolScale}, ${(canvasH - symbolH) / 2 - vb.y * symbolScale}) scale(${symbolScale})`,
		);
		for (const child of Array.from(base.children)) {
			symbolGroup.appendChild(child.cloneNode(true));
		}
		applyPaintToNode(svg, symbolGroup, brandColor, paintConfig);
		contentGroup.appendChild(symbolGroup);

		// Text after symbol + gap
		const textEl = document.createElementNS(NS, "text");
		textEl.textContent = horizontal.ht || " ";
		textEl.setAttribute("x", String(symbolW + gap));
		textEl.setAttribute("y", String(canvasH / 2 + fontSize * 0.34));
		textEl.setAttribute("font-family", horizontal.hf);
		textEl.setAttribute("font-size", String(fontSize));
		textEl.setAttribute("letter-spacing", String(letterSpacing));
		textEl.setAttribute("font-weight", String(horizontal.hfw));
		textEl.setAttribute("font-style", horizontal.hit ? "italic" : "normal");
		textEl.setAttribute("font-variant", horizontal.hsmc ? "small-caps" : "normal");
		applyPaintToText(svg, textEl, brandColor, horizontal.hst, strokeWidthPx, paintConfig);
		contentGroup.appendChild(textEl);

		svg.appendChild(contentGroup);

		// Mount first so getBBox works, then center the content group
		containerRef.current.replaceChildren(svg);
		try {
			const bbox = contentGroup.getBBox();
			const contentW = bbox.x + bbox.width;
			const offsetX = (canvasW - contentW) / 2;
			contentGroup.setAttribute("transform", `translate(${offsetX}, 0)`);
		} catch {
			// Fallback: estimate and center
			const text = horizontal.ht || " ";
			const estTextW = text.length * (fontSize * 0.6 + letterSpacing);
			const contentW = symbolW + gap + estTextW;
			const offsetX = Math.max(0, (canvasW - contentW) / 2);
			contentGroup.setAttribute("transform", `translate(${offsetX}, 0)`);
		}

		svgRef.current = svg;
	}, [symbolSvg, horizontal, paint, svgRef]);

	return (
		<div
			className="relative w-full bg-white rounded-lg overflow-hidden frame"
			style={{ aspectRatio: `${horizontal.hw} / ${horizontal.hh}` }}
		>
			<span className="frame-marks" />
			<div
				ref={containerRef}
				className="absolute inset-0 flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:block"
			/>
		</div>
	);
}
