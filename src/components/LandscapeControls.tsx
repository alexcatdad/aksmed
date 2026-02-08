import type { HorizontalParams } from "../types";
import { FontPicker } from "./ui/FontPicker";
import { RangeSlider } from "./ui/RangeSlider";
import { ToggleCheckbox } from "./ui/ToggleCheckbox";

interface LandscapeControlsProps {
	horizontal: HorizontalParams;
	setHorizontal: (updates: Partial<HorizontalParams>) => void;
}

export function LandscapeControls({ horizontal, setHorizontal }: LandscapeControlsProps) {
	return (
		<div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 p-4 bg-control rounded-[10px] mb-4 max-[600px]:grid-cols-2">
			<div className="flex flex-col gap-1.5">
				<span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-text-muted">
					Wordmark
				</span>
				<input
					type="text"
					className="w-full px-3 py-2.5 font-[family-name:var(--font-ui)] text-[13px] text-text-primary bg-input border border-border-default rounded-md outline-none transition-[border-color] duration-150 focus:border-gold-dim"
					value={horizontal.ht}
					onChange={(e) => setHorizontal({ ht: e.target.value })}
				/>
			</div>

			<FontPicker value={horizontal.hf} onChange={(hf) => setHorizontal({ hf })} />

			<RangeSlider
				label="Size"
				value={horizontal.hfs}
				min={48}
				max={180}
				step={1}
				onChange={(hfs) => setHorizontal({ hfs })}
			/>

			<RangeSlider
				label="Tracking"
				value={horizontal.hls}
				min={-2}
				max={12}
				step={0.1}
				onChange={(hls) => setHorizontal({ hls })}
				format={(v) => v.toFixed(1)}
			/>

			<RangeSlider
				label="Weight"
				value={horizontal.hfw}
				min={300}
				max={700}
				step={100}
				onChange={(hfw) => setHorizontal({ hfw })}
			/>

			<RangeSlider
				label="Stroke"
				value={horizontal.hst}
				min={0}
				max={3}
				step={0.05}
				onChange={(hst) => setHorizontal({ hst })}
				format={(v) => v.toFixed(2)}
			/>

			<RangeSlider
				label="Symbol Scale"
				value={horizontal.hsc}
				min={20}
				max={180}
				step={1}
				onChange={(hsc) => setHorizontal({ hsc })}
				format={(v) => `${v.toFixed(0)}%`}
			/>

			<RangeSlider
				label="Gap"
				value={horizontal.hg}
				min={16}
				max={220}
				step={1}
				onChange={(hg) => setHorizontal({ hg })}
			/>

			<div className="flex flex-row gap-4 items-center">
				<ToggleCheckbox
					label="Italic"
					checked={horizontal.hit}
					onChange={(hit) => setHorizontal({ hit })}
				/>
				<ToggleCheckbox
					label="Small Caps"
					checked={horizontal.hsmc}
					onChange={(hsmc) => setHorizontal({ hsmc })}
				/>
			</div>
		</div>
	);
}
