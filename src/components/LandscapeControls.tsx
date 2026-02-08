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
		<div className="grid grid-cols-3 gap-4 p-4 bg-control rounded-[10px] mb-4 max-[800px]:grid-cols-2 max-[500px]:grid-cols-1">
			<div className="flex flex-col gap-1.5 min-w-0">
				<span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-label">
					Document (cm)
				</span>
				<div className="flex gap-2">
					<input
						type="number"
						aria-label="Landscape width in centimeters"
						className="w-full min-w-0 px-2 py-2.5 font-[family-name:var(--font-ui)] text-[13px] text-text-primary bg-input border border-border-default rounded-md outline-none transition-[border-color] duration-150 focus:border-gold-dim"
						value={horizontal.hw}
						min={10}
						max={200}
						step={1}
						onChange={(e) => setHorizontal({ hw: Number(e.target.value) })}
					/>
					<span className="text-text-muted self-center text-[11px]" aria-hidden="true">
						&times;
					</span>
					<input
						type="number"
						aria-label="Landscape height in centimeters"
						className="w-full min-w-0 px-2 py-2.5 font-[family-name:var(--font-ui)] text-[13px] text-text-primary bg-input border border-border-default rounded-md outline-none transition-[border-color] duration-150 focus:border-gold-dim"
						value={horizontal.hh}
						min={3}
						max={100}
						step={1}
						onChange={(e) => setHorizontal({ hh: Number(e.target.value) })}
					/>
				</div>
			</div>

			<label className="flex flex-col gap-1.5">
				<span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-label">
					Wordmark
				</span>
				<input
					type="text"
					className="w-full px-3 py-2.5 font-[family-name:var(--font-ui)] text-[13px] text-text-primary bg-input border border-border-default rounded-md outline-none transition-[border-color] duration-150 focus:border-gold-dim"
					value={horizontal.ht}
					onChange={(e) => setHorizontal({ ht: e.target.value })}
				/>
			</label>

			<FontPicker value={horizontal.hf} onChange={(hf) => setHorizontal({ hf })} />

			<RangeSlider
				label="Size"
				value={horizontal.hfs}
				min={3}
				max={25}
				step={0.5}
				onChange={(hfs) => setHorizontal({ hfs })}
				format={(v) => `${v.toFixed(1)}%`}
			/>

			<RangeSlider
				label="Tracking"
				value={horizontal.hls}
				min={-0.2}
				max={2}
				step={0.05}
				onChange={(hls) => setHorizontal({ hls })}
				format={(v) => `${v.toFixed(2)}%`}
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
				min={5}
				max={50}
				step={1}
				onChange={(hsc) => setHorizontal({ hsc })}
				format={(v) => `${v.toFixed(0)}%`}
			/>

			<RangeSlider
				label="Gap"
				value={horizontal.hg}
				min={0.5}
				max={15}
				step={0.5}
				onChange={(hg) => setHorizontal({ hg })}
				format={(v) => `${v.toFixed(1)}%`}
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
