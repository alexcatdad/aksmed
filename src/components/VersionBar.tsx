interface VersionBarProps {
	total: number;
	displayIndex: number;
	canPrev: boolean;
	canNext: boolean;
	onSave: () => void;
	onPrev: () => void;
	onNext: () => void;
	onClear: () => void;
}

export function VersionBar({
	total,
	displayIndex,
	canPrev,
	canNext,
	onSave,
	onPrev,
	onNext,
	onClear,
}: VersionBarProps) {
	return (
		<div className="flex items-center gap-2 ml-auto">
			<span className="text-[11px] font-medium tracking-[0.04em] uppercase text-text-muted">
				Versions
			</span>

			<div className="flex items-center gap-1">
				<button
					type="button"
					disabled={!canPrev}
					onClick={onPrev}
					title="Previous version"
					className="flex items-center justify-center w-7 h-7 p-0 text-sm text-text-secondary bg-input border border-border-default rounded-md cursor-pointer transition-all duration-150 hover:enabled:text-text-primary hover:enabled:border-border-hover hover:enabled:bg-control disabled:opacity-35 disabled:cursor-not-allowed"
				>
					<svg
						className="w-3.5 h-3.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="15 18 9 12 15 6" />
					</svg>
				</button>

				<span
					className={`font-mono text-[11px] min-w-12 text-center ${total > 0 ? "text-gold-dim" : "text-text-muted"}`}
				>
					{total > 0 ? `${displayIndex} / ${total}` : "0 / 0"}
				</span>

				<button
					type="button"
					disabled={!canNext}
					onClick={onNext}
					title="Next version"
					className="flex items-center justify-center w-7 h-7 p-0 text-sm text-text-secondary bg-input border border-border-default rounded-md cursor-pointer transition-all duration-150 hover:enabled:text-text-primary hover:enabled:border-border-hover hover:enabled:bg-control disabled:opacity-35 disabled:cursor-not-allowed"
				>
					<svg
						className="w-3.5 h-3.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="9 18 15 12 9 6" />
					</svg>
				</button>
			</div>

			<button
				type="button"
				onClick={onSave}
				title="Save current state as version"
				className="inline-flex items-center gap-[5px] px-3 py-1.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold tracking-[0.06em] uppercase text-gold bg-[rgba(201,169,98,0.08)] border border-gold-dim rounded-md cursor-pointer transition-all duration-150 hover:bg-[rgba(201,169,98,0.15)] hover:border-gold"
			>
				<svg
					className="w-3 h-3"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
					<polyline points="17 21 17 13 7 13 7 21" />
					<polyline points="7 3 7 8 15 8" />
				</svg>
				Save
			</button>

			<button
				type="button"
				onClick={onClear}
				title="Clear all versions"
				className="inline-flex items-center justify-center w-6 h-6 p-0 text-text-muted bg-transparent border border-transparent rounded cursor-pointer transition-all duration-150 hover:text-[#e57373] hover:border-[rgba(229,115,115,0.3)] hover:bg-[rgba(229,115,115,0.08)]"
			>
				<svg
					className="w-3 h-3"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polyline points="3 6 5 6 21 6" />
					<path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
				</svg>
			</button>
		</div>
	);
}
