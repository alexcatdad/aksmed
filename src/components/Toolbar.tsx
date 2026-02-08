import type { PaintParams } from "../types";

interface ToolbarProps {
	paint: PaintParams;
	setPaint: (updates: Partial<PaintParams>) => void;
	children: React.ReactNode;
}

export function Toolbar({ paint, setPaint, children }: ToolbarProps) {
	const isGold = paint.pm === "gold";

	return (
		<div className="flex items-center gap-5 px-5 py-3.5 bg-card border border-border-subtle rounded-xl mb-7 flex-wrap max-[600px]:[&_.toolbar-divider]:hidden">
			{/* Paint mode */}
			<div className="flex items-center gap-3">
				<span className="text-[11px] font-medium tracking-[0.04em] uppercase text-text-muted">
					Style
				</span>
				<select
					className="px-3 py-2 pr-8 font-[family-name:var(--font-ui)] text-[13px] text-text-primary bg-input border border-border-default rounded-md cursor-pointer transition-[border-color] duration-150 hover:border-border-hover focus:outline-none focus:border-gold-dim"
					value={paint.pm}
					onChange={(e) => setPaint({ pm: e.target.value })}
				>
					<option value="solid">Solid Color</option>
					<option value="gold">Metallic Gold</option>
				</select>
			</div>

			{/* Gold sliders */}
			{isGold && (
				<>
					<div className="flex items-center gap-2">
						<span className="text-[11px] font-medium tracking-[0.04em] uppercase text-text-muted">
							Shine
						</span>
						<input
							type="range"
							className="w-[72px] h-[3px]"
							min={0}
							max={100}
							step={1}
							value={paint.gl}
							onChange={(e) => setPaint({ gl: Number.parseFloat(e.target.value) })}
						/>
						<span className="font-mono text-[10px] text-gold-dim min-w-7">
							{Math.round(paint.gl)}%
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-[11px] font-medium tracking-[0.04em] uppercase text-text-muted">
							Depth
						</span>
						<input
							type="range"
							className="w-[72px] h-[3px]"
							min={0}
							max={100}
							step={1}
							value={paint.gd}
							onChange={(e) => setPaint({ gd: Number.parseFloat(e.target.value) })}
						/>
						<span className="font-mono text-[10px] text-gold-dim min-w-7">
							{Math.round(paint.gd)}%
						</span>
					</div>
				</>
			)}

			{/* Divider */}
			<div className="toolbar-divider w-px h-5 bg-border-default" />

			{/* Brand color */}
			<div className="flex items-center gap-3">
				<span className="text-[11px] font-medium tracking-[0.04em] uppercase text-text-muted">
					Brand
				</span>
				<input
					type="color"
					className="w-7 h-7 border-2 border-border-default rounded-md transition-[border-color] duration-150 hover:border-border-hover"
					value={paint.bc}
					disabled={isGold}
					style={{ opacity: isGold ? 0.55 : 1 }}
					title={isGold ? "Disabled while gold style is enabled." : ""}
					onChange={(e) => setPaint({ bc: e.target.value })}
				/>
				<span className="font-mono text-[11px] text-text-muted tracking-[0.02em]">
					{isGold ? "GOLD" : paint.bc.toUpperCase()}
				</span>
			</div>

			{/* Divider */}
			<div className="toolbar-divider w-px h-5 bg-border-default" />

			{/* Version bar slot */}
			{children}
		</div>
	);
}
