import { DEFAULT_FONT_CSS } from "./fonts";

export const PORTRAIT_DEFAULTS = {
	l1: "AKSMED",
	l2: "CLINIQUE",
	f: DEFAULT_FONT_CSS,
	l1s: 196,
	l2s: 116,
	l1ls: 25,
	l2ls: 50,
	lns: 1,
	fw: 700,
	st: 0,
	sc: 69,
	it: false,
	smc: false,
} as const;

export const HORIZONTAL_DEFAULTS = {
	ht: "AKSMED CLINIQUE",
	hf: DEFAULT_FONT_CSS,
	hfs: 180,
	hls: 10,
	hfw: 700,
	hst: 0.4,
	hsc: 40,
	hg: 40,
	hit: false,
	hsmc: false,
} as const;

export const PAINT_DEFAULTS = {
	pm: "gold",
	gl: 100,
	gd: 100,
	bc: "#000000",
} as const;
