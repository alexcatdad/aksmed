interface RangeSliderProps {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	onChange: (value: number) => void;
	format?: (value: number) => string;
}

export function RangeSlider({ label, value, min, max, step, onChange, format }: RangeSliderProps) {
	const display = format ? format(value) : String(value);

	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-text-muted">
				{label}
			</span>
			<div className="flex items-center gap-2.5">
				<input
					type="range"
					className="flex-1"
					min={min}
					max={max}
					step={step}
					value={value}
					onChange={(e) => onChange(Number.parseFloat(e.target.value))}
				/>
				<output className="min-w-12 font-mono text-[11px] text-right text-gold-dim">
					{display}
				</output>
			</div>
		</div>
	);
}
