interface ToggleCheckboxProps {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}

export function ToggleCheckbox({ label, checked, onChange }: ToggleCheckboxProps) {
	return (
		<label className="flex items-center gap-2 cursor-pointer text-text-secondary text-xs">
			<input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
			{label}
		</label>
	);
}
