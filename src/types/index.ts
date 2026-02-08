export interface FontOption {
	label: string;
	css: string;
	google: string;
}

export interface PortraitParams {
	l1: string;
	l2: string;
	f: string;
	l1s: number;
	l2s: number;
	l1ls: number;
	l2ls: number;
	lns: number;
	fw: number;
	st: number;
	sc: number;
	it: boolean;
	smc: boolean;
}

export interface HorizontalParams {
	ht: string;
	hf: string;
	hfs: number;
	hls: number;
	hfw: number;
	hst: number;
	hsc: number;
	hg: number;
	hit: boolean;
	hsmc: boolean;
}

export interface PaintParams {
	pm: string;
	gl: number;
	gd: number;
	bc: string;
}

export interface VersionSnapshot {
	params: Record<string, string | number | boolean>;
	timestamp: number;
	label: string;
}

export interface ViewBox {
	x: number;
	y: number;
	width: number;
	height: number;
}
