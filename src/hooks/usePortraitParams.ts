import { parseAsBoolean, parseAsFloat, parseAsString, useQueryStates } from "nuqs";
import { PORTRAIT_DEFAULTS } from "../constants/defaults";

const portraitParsers = {
	pw: parseAsFloat.withDefault(PORTRAIT_DEFAULTS.pw),
	ph: parseAsFloat.withDefault(PORTRAIT_DEFAULTS.ph),
	l1: parseAsString.withDefault(PORTRAIT_DEFAULTS.l1),
	l2: parseAsString.withDefault(PORTRAIT_DEFAULTS.l2),
	f: parseAsString.withDefault(PORTRAIT_DEFAULTS.f),
	l1s: parseAsFloat.withDefault(PORTRAIT_DEFAULTS.l1s),
	l2s: parseAsFloat.withDefault(PORTRAIT_DEFAULTS.l2s),
	l1ls: parseAsFloat.withDefault(PORTRAIT_DEFAULTS.l1ls),
	l2ls: parseAsFloat.withDefault(PORTRAIT_DEFAULTS.l2ls),
	lns: parseAsFloat.withDefault(PORTRAIT_DEFAULTS.lns),
	fw: parseAsFloat.withDefault(PORTRAIT_DEFAULTS.fw),
	st: parseAsFloat.withDefault(PORTRAIT_DEFAULTS.st),
	sc: parseAsFloat.withDefault(PORTRAIT_DEFAULTS.sc),
	ty: parseAsFloat.withDefault(PORTRAIT_DEFAULTS.ty),
	it: parseAsBoolean.withDefault(PORTRAIT_DEFAULTS.it),
	smc: parseAsBoolean.withDefault(PORTRAIT_DEFAULTS.smc),
};

export function usePortraitParams() {
	return useQueryStates(portraitParsers, { history: "replace" });
}
