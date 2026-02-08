import { useEffect, useRef } from "react";
import { applyPaintToNode, applyPaintToText } from "../lib/paint";
import { parseViewBox } from "../lib/svg-utils";
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

		const text = horizontal.ht || " ";
		const font = horizontal.hf;
		const fontSize = horizontal.hfs;
		const letterSpacing = horizontal.hls;
		const fontWeight = horizontal.hfw;
		const strokeThicknessPct = horizontal.hst;
		const strokeWidthPx = (fontSize * strokeThicknessPct) / 100;
		const logoScale = horizontal.hsc / 100;
		const gap = horizontal.hg;

		const base = symbolSvg;
		const vb = parseViewBox(base);
		const symbolW = Math.max(1, vb.width * logoScale);
		const symbolH = Math.max(1, vb.height * logoScale);

		const pad = 28;
		// Use a large initial viewBox, then measure and shrink
		const initWidth = 4000;
		const initHeight = Math.ceil(Math.max(symbolH, fontSize * 1.8) + pad * 2);

		const svg = document.createElementNS(NS, "svg") as SVGSVGElement;
		svg.setAttribute("xmlns", NS);
		svg.setAttribute("viewBox", `0 0 ${initWidth} ${initHeight}`);
		svg.setAttribute("width", "100%");
		svg.setAttribute("height", "100%");
		svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

		const symbolGroup = document.createElementNS(NS, "g") as SVGGElement;
		symbolGroup.setAttribute(
			"transform",
			`translate(${pad - vb.x * logoScale}, ${(initHeight - symbolH) / 2 - vb.y * logoScale}) scale(${logoScale})`,
		);
		for (const child of Array.from(base.children)) {
			symbolGroup.appendChild(child.cloneNode(true));
		}
		applyPaintToNode(svg, symbolGroup, brandColor, paintConfig);
		svg.appendChild(symbolGroup);

		const textEl = document.createElementNS(NS, "text");
		textEl.textContent = text;
		textEl.setAttribute("x", String(pad + symbolW + gap));
		textEl.setAttribute("y", String(initHeight / 2 + fontSize * 0.34));
		textEl.setAttribute("font-family", font);
		textEl.setAttribute("font-size", String(fontSize));
		textEl.setAttribute("letter-spacing", String(letterSpacing));
		textEl.setAttribute("font-weight", String(fontWeight));
		textEl.setAttribute("font-style", horizontal.hit ? "italic" : "normal");
		textEl.setAttribute("font-variant", horizontal.hsmc ? "small-caps" : "normal");
		applyPaintToText(svg, textEl, brandColor, strokeThicknessPct, strokeWidthPx, paintConfig);
		svg.appendChild(textEl);

		// Mount first so getBBox works, then measure and tighten the viewBox
		containerRef.current.replaceChildren(svg);
		try {
			const textBox = textEl.getBBox();
			const finalWidth = Math.ceil(textBox.x + textBox.width + pad);
			svg.setAttribute("viewBox", `0 0 ${finalWidth} ${initHeight}`);
		} catch {
			// Fallback: use generous estimate
			const fallbackWidth = Math.ceil(
				pad * 2 + symbolW + gap + text.length * (fontSize * 0.8 + letterSpacing),
			);
			svg.setAttribute("viewBox", `0 0 ${fallbackWidth} ${initHeight}`);
		}

		svgRef.current = svg;
	}, [symbolSvg, horizontal, paint, svgRef]);

	return (
		<div
			className="relative w-full bg-white rounded-lg overflow-hidden frame"
			style={{ aspectRatio: "3.5 / 1" }}
		>
			<span className="frame-marks" />
			<div
				ref={containerRef}
				className="absolute inset-0 flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:block"
			/>
		</div>
	);
}
