import { FONT_OPTIONS } from "../../constants/fonts";

interface FontPickerProps {
	value: string;
	onChange: (css: string) => void;
}

export function FontPicker({ value, onChange }: FontPickerProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-text-muted">
				Typeface
			</span>
			<select
				className="w-full px-3 py-2.5 pr-8 font-[family-name:var(--font-ui)] text-[13px] text-text-primary bg-input border border-border-default rounded-md outline-none transition-[border-color] duration-150 focus:border-gold-dim"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			>
				{FONT_OPTIONS.map((opt) => (
					<option key={opt.label} value={opt.css}>
						{opt.label}
					</option>
				))}
			</select>
		</div>
	);
}
