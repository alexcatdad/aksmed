import { DEFAULT_FONT_CSS } from "./fonts";

export const PORTRAIT_DEFAULTS = {
	pw: 20,
	ph: 28,
	l1: "AKSMED",
	l2: "CLINIQUE",
	f: DEFAULT_FONT_CSS,
	l1s: 25,
	l2s: 15,
	l1ls: 3.2,
	l2ls: 6.4,
	lns: 1,
	fw: 700,
	st: 0,
	sc: 69,
	ty: 82.5,
	it: false,
	smc: false,
} as const;

export const HORIZONTAL_DEFAULTS = {
	hw: 40,
	hh: 10,
	ht: "AKSMED CLINIQUE",
	hf: DEFAULT_FONT_CSS,
	hfs: 9,
	hls: 0.5,
	hfw: 700,
	hst: 0.4,
	hsc: 16,
	hg: 2,
	hit: false,
	hsmc: false,
} as const;

export const PAINT_DEFAULTS = {
	pm: "gold",
	gl: 100,
	gd: 100,
	bc: "#000000",
} as const;
