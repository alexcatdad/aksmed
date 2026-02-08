interface HeaderProps {
	onRefresh: () => void;
}

export function Header({ onRefresh }: HeaderProps) {
	return (
		<header className="flex items-end justify-between gap-6 mb-8 pb-6 border-b border-border-subtle max-[960px]:flex-col max-[960px]:items-start">
			<div className="flex flex-col gap-1">
				<span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold-dim">
					Print Studio
				</span>
				<h1 className="font-display text-[28px] font-normal tracking-[0.02em] text-text-primary">
					AKSMED Logo Lockups
				</h1>
			</div>
			<button
				type="button"
				onClick={onRefresh}
				className="inline-flex items-center gap-1.5 px-[18px] py-2.5 font-[family-name:var(--font-ui)] text-xs font-semibold tracking-[0.06em] uppercase text-text-inverse bg-gradient-to-b from-gold-bright to-gold rounded-lg cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_4px_12px_var(--color-gold-glow),inset_0_1px_0_rgba(255,255,255,0.25)] active:translate-y-0"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M21 12a9 9 0 11-3-6.7" />
					<path d="M21 3v6h-6" />
				</svg>
				Refresh
			</button>
		</header>
	);
}
