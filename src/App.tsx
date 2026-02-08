import { useCallback } from "react";
import { Header } from "./components/Header";
import { LandscapeCard } from "./components/LandscapeCard";
import { PortraitCard } from "./components/PortraitCard";
import { ReferenceCard } from "./components/ReferenceCard";
import { Toolbar } from "./components/Toolbar";
import { VersionBar } from "./components/VersionBar";
import { useGoogleFont } from "./hooks/useGoogleFont";
import { useHorizontalParams } from "./hooks/useHorizontalParams";
import { usePaintParams } from "./hooks/usePaintParams";
import { usePortraitParams } from "./hooks/usePortraitParams";
import { useSvgLoader } from "./hooks/useSvgLoader";
import { useVersionHistory } from "./hooks/useVersionHistory";

export default function App() {
	const { editableSvg, symbolSvg, loading, error, reload } = useSvgLoader();
	const [portrait, setPortrait] = usePortraitParams();
	const [horizontal, setHorizontal] = useHorizontalParams();
	const [paint, setPaint] = usePaintParams();

	// Load Google Fonts when font selections change
	useGoogleFont(portrait.f);
	useGoogleFont(horizontal.hf);

	// Version history: gather all params and apply them
	const getCurrentParams = useCallback(
		() => ({
			...portrait,
			...horizontal,
			...paint,
		}),
		[portrait, horizontal, paint],
	);

	const applyParams = useCallback(
		(params: Record<string, string | number | boolean>) => {
			const hKeys = new Set(["ht", "hf", "hfs", "hls", "hfw", "hst", "hsc", "hg", "hit", "hsmc"]);
			const paKeys = new Set(["pm", "gl", "gd", "bc"]);
			const p: Record<string, string | number | boolean> = {};
			const h: Record<string, string | number | boolean> = {};
			const pa: Record<string, string | number | boolean> = {};

			for (const [k, v] of Object.entries(params)) {
				if (hKeys.has(k)) h[k] = v;
				else if (paKeys.has(k)) pa[k] = v;
				else p[k] = v;
			}

			setPortrait(p as Parameters<typeof setPortrait>[0]);
			setHorizontal(h as Parameters<typeof setHorizontal>[0]);
			setPaint(pa as Parameters<typeof setPaint>[0]);
		},
		[setPortrait, setHorizontal, setPaint],
	);

	const version = useVersionHistory(getCurrentParams, applyParams);

	const statusText = loading
		? "Loading..."
		: error
			? `Error: ${error}`
			: `Loaded: ${new Date().toLocaleTimeString()}`;

	return (
		<div className="relative z-[1] max-w-[1320px] mx-auto px-10 pt-8 pb-12 max-[960px]:px-6">
			<Header onRefresh={reload} />

			<Toolbar paint={paint} setPaint={setPaint}>
				<VersionBar
					total={version.total}
					displayIndex={version.displayIndex}
					canPrev={version.canPrev}
					canNext={version.canNext}
					onSave={version.saveVersion}
					onPrev={version.goPrev}
					onNext={version.goNext}
					onClear={version.clearAll}
				/>
			</Toolbar>

			<div className="grid grid-cols-2 gap-6 max-[960px]:grid-cols-1">
				<ReferenceCard />
				<PortraitCard
					editableSvg={editableSvg}
					portrait={portrait}
					setPortrait={setPortrait}
					paint={paint}
				/>

				{/* Section divider */}
				<div className="col-span-full flex items-center gap-4 py-2">
					<div className="flex-1 h-px bg-gradient-to-r from-transparent via-border-default to-transparent" />
					<span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-text-muted">
						Horizontal Lockup
					</span>
					<div className="flex-1 h-px bg-gradient-to-r from-transparent via-border-default to-transparent" />
				</div>

				<LandscapeCard
					symbolSvg={symbolSvg}
					horizontal={horizontal}
					setHorizontal={setHorizontal}
					paint={paint}
				/>
			</div>

			<div className="mt-6 px-4 py-3 font-mono text-[11px] text-text-muted bg-card border border-border-subtle rounded-lg flex items-center gap-2">
				<span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse-dot" />
				{statusText}
			</div>
		</div>
	);
}
