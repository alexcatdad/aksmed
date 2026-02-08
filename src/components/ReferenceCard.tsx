const base = import.meta.env.BASE_URL;

export function ReferenceCard() {
	return (
		<section className="bg-card border border-border-subtle rounded-2xl overflow-hidden">
			<div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
				<div className="flex items-center gap-3">
					<span className="px-2.5 py-1 text-[9px] font-semibold tracking-[0.15em] uppercase text-gold bg-[rgba(201,169,98,0.1)] rounded">
						Reference
					</span>
					<h2 className="font-display text-lg font-normal text-text-primary tracking-[0.01em]">
						Original
					</h2>
				</div>
			</div>
			<div className="p-5">
				<div className="relative bg-void rounded-lg overflow-hidden aspect-square grid place-items-center frame dark">
					<span className="frame-marks" />
					<img
						src={`${base}logo.png`}
						alt="Original source"
						className="w-full h-full object-contain block"
					/>
				</div>
			</div>
		</section>
	);
}
