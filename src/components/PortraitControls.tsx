import type { PortraitParams } from "../types";
import { FontPicker } from "./ui/FontPicker";
import { RangeSlider } from "./ui/RangeSlider";
import { ToggleCheckbox } from "./ui/ToggleCheckbox";

interface PortraitControlsProps {
	portrait: PortraitParams;
	setPortrait: (updates: Partial<PortraitParams>) => void;
}

export function PortraitControls({ portrait, setPortrait }: PortraitControlsProps) {
	return (
		<div className="grid grid-cols-3 gap-4 p-4 bg-control rounded-[10px] mb-4 max-[800px]:grid-cols-2 max-[500px]:grid-cols-1">
			<div className="flex flex-col gap-1.5 min-w-0">
				<span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-label">
					Document (cm)
				</span>
				<div className="flex gap-2">
					<input
						type="number"
						aria-label="Portrait width in centimeters"
						className="w-full min-w-0 px-2 py-2.5 font-[family-name:var(--font-ui)] text-[13px] text-text-primary bg-input border border-border-default rounded-md outline-none transition-[border-color] duration-150 focus:border-gold-dim"
						value={portrait.pw}
						min={5}
						max={100}
						step={1}
						onChange={(e) => setPortrait({ pw: Number(e.target.value) })}
					/>
					<span className="text-text-muted self-center text-[11px]" aria-hidden="true">
						&times;
					</span>
					<input
						type="number"
						aria-label="Portrait height in centimeters"
						className="w-full min-w-0 px-2 py-2.5 font-[family-name:var(--font-ui)] text-[13px] text-text-primary bg-input border border-border-default rounded-md outline-none transition-[border-color] duration-150 focus:border-gold-dim"
						value={portrait.ph}
						min={5}
						max={100}
						step={1}
						onChange={(e) => setPortrait({ ph: Number(e.target.value) })}
					/>
				</div>
			</div>

			<label className="flex flex-col gap-1.5">
				<span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-label">
					Line 1
				</span>
				<input
					type="text"
					className="w-full px-3 py-2.5 font-[family-name:var(--font-ui)] text-[13px] text-text-primary bg-input border border-border-default rounded-md outline-none transition-[border-color] duration-150 focus:border-gold-dim"
					value={portrait.l1}
					onChange={(e) => setPortrait({ l1: e.target.value })}
				/>
			</label>

			<label className="flex flex-col gap-1.5">
				<span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-label">
					Line 2
				</span>
				<input
					type="text"
					className="w-full px-3 py-2.5 font-[family-name:var(--font-ui)] text-[13px] text-text-primary bg-input border border-border-default rounded-md outline-none transition-[border-color] duration-150 focus:border-gold-dim"
					value={portrait.l2}
					onChange={(e) => setPortrait({ l2: e.target.value })}
				/>
			</label>

			<FontPicker value={portrait.f} onChange={(f) => setPortrait({ f })} />

			<RangeSlider
				label="Line 1 Size"
				value={portrait.l1s}
				min={5}
				max={35}
				step={0.5}
				onChange={(l1s) => setPortrait({ l1s })}
				format={(v) => `${v.toFixed(1)}%`}
			/>

			<RangeSlider
				label="Line 2 Size"
				value={portrait.l2s}
				min={5}
				max={35}
				step={0.5}
				onChange={(l2s) => setPortrait({ l2s })}
				format={(v) => `${v.toFixed(1)}%`}
			/>

			<RangeSlider
				label="Line 1 Tracking"
				value={portrait.l1ls}
				min={-0.5}
				max={10}
				step={0.1}
				onChange={(l1ls) => setPortrait({ l1ls })}
				format={(v) => `${v.toFixed(1)}%`}
			/>

			<RangeSlider
				label="Line 2 Tracking"
				value={portrait.l2ls}
				min={-0.5}
				max={10}
				step={0.1}
				onChange={(l2ls) => setPortrait({ l2ls })}
				format={(v) => `${v.toFixed(1)}%`}
			/>

			<RangeSlider
				label="Leading"
				value={portrait.lns}
				min={0.7}
				max={1.6}
				step={0.01}
				onChange={(lns) => setPortrait({ lns })}
				format={(v) => v.toFixed(2)}
			/>

			<RangeSlider
				label="Weight"
				value={portrait.fw}
				min={300}
				max={700}
				step={100}
				onChange={(fw) => setPortrait({ fw })}
			/>

			<RangeSlider
				label="Stroke"
				value={portrait.st}
				min={0}
				max={3}
				step={0.05}
				onChange={(st) => setPortrait({ st })}
				format={(v) => v.toFixed(2)}
			/>

			<RangeSlider
				label="Symbol Scale"
				value={portrait.sc}
				min={10}
				max={90}
				step={1}
				onChange={(sc) => setPortrait({ sc })}
				format={(v) => `${v.toFixed(0)}%`}
			/>

			<RangeSlider
				label="Text Distance"
				value={portrait.ty}
				min={55}
				max={95}
				step={0.5}
				onChange={(ty) => setPortrait({ ty })}
				format={(v) => `${v.toFixed(1)}%`}
			/>

			<div className="flex flex-row gap-4 items-center">
				<ToggleCheckbox
					label="Italic"
					checked={portrait.it}
					onChange={(it) => setPortrait({ it })}
				/>
				<ToggleCheckbox
					label="Small Caps"
					checked={portrait.smc}
					onChange={(smc) => setPortrait({ smc })}
				/>
			</div>
		</div>
	);
}
