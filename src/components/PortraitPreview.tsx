import { useEffect, useRef, useState } from "react";
import { applyPaintToNode, applyPaintToText } from "../lib/paint";
import { parseViewBox } from "../lib/svg-utils";
import type { PaintParams, PortraitParams } from "../types";

interface PortraitPreviewProps {
	editableSvg: SVGSVGElement | null;
	portrait: PortraitParams;
	paint: PaintParams;
	svgRef: React.RefObject<SVGSVGElement | null>;
}

export function PortraitPreview({ editableSvg, portrait, paint, svgRef }: PortraitPreviewProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const baseY1Ref = useRef<number | null>(null);
	const symbolWrapperRef = useRef<SVGGElement | null>(null);
	const symbolCenterRef = useRef<{ x: number; y: number } | null>(null);
	const [mountVersion, setMountVersion] = useState(0);

	// Mount the SVG once
	useEffect(() => {
		if (!editableSvg || !containerRef.current) return;
		const clone = editableSvg.cloneNode(true) as SVGSVGElement;
		containerRef.current.replaceChildren(clone);
		svgRef.current = clone;

		// Read initial positions from SVG template
		const t1 = clone.querySelector("#line1") as SVGTextElement | null;
		const t2 = clone.querySelector("#line2") as SVGTextElement | null;
		if (t1 && t2) {
			baseY1Ref.current = Number.parseFloat(t1.getAttribute("y") || "0");
		}

		// Ensure symbol wrapper
		let wrapper = clone.querySelector("#logo-symbol-wrapper") as SVGGElement | null;
		if (!wrapper) {
			const firstGroup = clone.querySelector("g");
			if (firstGroup) {
				wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g") as SVGGElement;
				wrapper.setAttribute("id", "logo-symbol-wrapper");
				firstGroup.parentNode?.insertBefore(wrapper, firstGroup);
				wrapper.appendChild(firstGroup);
			}
		}
		symbolWrapperRef.current = wrapper;

		if (wrapper) {
			try {
				const bbox = wrapper.getBBox();
				symbolCenterRef.current = {
					x: bbox.x + bbox.width / 2,
					y: bbox.y + bbox.height / 2,
				};
			} catch {
				const vb = parseViewBox(clone);
				symbolCenterRef.current = {
					x: vb.x + vb.width / 2,
					y: vb.y + vb.height / 2,
				};
			}
		}
		setMountVersion((v) => v + 1);
	}, [editableSvg, svgRef]);

	// Apply controls reactively (mountVersion triggers re-run after SVG clone mounts)
	useEffect(() => {
		if (mountVersion < 1) return;
		const svg = svgRef.current;
		if (!svg) return;

		const t1 = svg.querySelector("#line1") as SVGTextElement | null;
		const t2 = svg.querySelector("#line2") as SVGTextElement | null;
		if (!t1 || !t2) return;

		const isGold = paint.pm === "gold";
		const brandColor = paint.bc;
		const lightness = Math.max(0, Math.min(100, paint.gl));
		const darkness = Math.max(0, Math.min(100, paint.gd));
		const paintConfig = { isGold, lightness, darkness };

		const y1 = baseY1Ref.current ?? Number.parseFloat(t1.getAttribute("y") || "0");
		const y2 = y1 + portrait.l2s * portrait.lns;

		const strokeWidth1 = (portrait.l1s * portrait.st) / 100;
		const strokeWidth2 = (portrait.l2s * portrait.st) / 100;
		const logoScale = portrait.sc / 100;

		// Line 1
		t1.setAttribute("font-family", portrait.f);
		t1.setAttribute("letter-spacing", String(portrait.l1ls));
		t1.setAttribute("font-weight", String(portrait.fw));
		t1.setAttribute("font-style", portrait.it ? "italic" : "normal");
		t1.setAttribute("font-variant", portrait.smc ? "small-caps" : "normal");
		t1.setAttribute("font-size", String(portrait.l1s));
		t1.setAttribute("y", String(y1));
		t1.textContent = portrait.l1 || " ";

		// Line 2
		t2.setAttribute("font-family", portrait.f);
		t2.setAttribute("letter-spacing", String(portrait.l2ls));
		t2.setAttribute("font-weight", String(portrait.fw));
		t2.setAttribute("font-style", portrait.it ? "italic" : "normal");
		t2.setAttribute("font-variant", portrait.smc ? "small-caps" : "normal");
		t2.setAttribute("font-size", String(portrait.l2s));
		t2.setAttribute("y", String(y2));
		t2.textContent = portrait.l2 || " ";

		applyPaintToText(svg, t1, brandColor, portrait.st, strokeWidth1, paintConfig);
		applyPaintToText(svg, t2, brandColor, portrait.st, strokeWidth2, paintConfig);

		// Symbol
		const wrapper = symbolWrapperRef.current;
		if (wrapper) {
			applyPaintToNode(svg, wrapper, brandColor, paintConfig);
			const center = symbolCenterRef.current;
			if (center) {
				wrapper.setAttribute(
					"transform",
					`translate(${center.x} ${center.y}) scale(${logoScale}) translate(${-center.x} ${-center.y})`,
				);
			}
		}
	}, [mountVersion, portrait, paint, svgRef]);

	return (
		<div className="portrait-preview relative bg-white rounded-lg overflow-hidden aspect-square frame">
			<span className="frame-marks" />
			<div
				ref={containerRef}
				className="absolute inset-0 flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:block"
			/>
		</div>
	);
}
