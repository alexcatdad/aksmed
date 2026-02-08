import { useRef } from "react";
import { downloadSvg } from "../lib/export";
import type { HorizontalParams, PaintParams } from "../types";
import { LandscapeControls } from "./LandscapeControls";
import { LandscapePreview } from "./LandscapePreview";

interface LandscapeCardProps {
	symbolSvg: SVGSVGElement | null;
	horizontal: HorizontalParams;
	setHorizontal: (updates: Partial<HorizontalParams>) => void;
	paint: PaintParams;
}

function ExportIcon() {
	return (
		<svg
			className="w-3 h-3"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
			<polyline points="7 10 12 15 17 10" />
			<line x1="12" y1="15" x2="12" y2="3" />
		</svg>
	);
}

export function LandscapeCard({ symbolSvg, horizontal, setHorizontal, paint }: LandscapeCardProps) {
	const svgRef = useRef<SVGSVGElement | null>(null);

	return (
		<section className="bg-card border border-border-subtle rounded-2xl overflow-hidden col-span-full">
			<div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
				<div className="flex items-center gap-3">
					<span className="px-2.5 py-1 text-[9px] font-semibold tracking-[0.15em] uppercase text-gold bg-[rgba(201,169,98,0.1)] rounded">
						Landscape
					</span>
					<h2 className="font-display text-lg font-normal text-text-primary tracking-[0.01em]">
						Symbol + Wordmark
					</h2>
				</div>
				<button
					type="button"
					onClick={() =>
						svgRef.current && downloadSvg(svgRef.current, "aksmed-landscape-current.svg")
					}
					className="inline-flex items-center gap-1.5 px-3.5 py-2 font-[family-name:var(--font-ui)] text-[11px] font-semibold tracking-[0.05em] uppercase text-gold bg-transparent border border-gold-dim rounded-md cursor-pointer transition-all duration-150 hover:text-text-inverse hover:bg-gold hover:border-gold"
				>
					<ExportIcon />
					Export
				</button>
			</div>
			<div className="p-5">
				<LandscapeControls horizontal={horizontal} setHorizontal={setHorizontal} />
				<LandscapePreview
					symbolSvg={symbolSvg}
					horizontal={horizontal}
					paint={paint}
					svgRef={svgRef}
				/>
			</div>
		</section>
	);
}
