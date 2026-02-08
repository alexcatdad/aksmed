import { parseAsBoolean, parseAsFloat, parseAsString, useQueryStates } from "nuqs";
import { HORIZONTAL_DEFAULTS } from "../constants/defaults";

const horizontalParsers = {
	hw: parseAsFloat.withDefault(HORIZONTAL_DEFAULTS.hw),
	hh: parseAsFloat.withDefault(HORIZONTAL_DEFAULTS.hh),
	ht: parseAsString.withDefault(HORIZONTAL_DEFAULTS.ht),
	hf: parseAsString.withDefault(HORIZONTAL_DEFAULTS.hf),
	hfs: parseAsFloat.withDefault(HORIZONTAL_DEFAULTS.hfs),
	hls: parseAsFloat.withDefault(HORIZONTAL_DEFAULTS.hls),
	hfw: parseAsFloat.withDefault(HORIZONTAL_DEFAULTS.hfw),
	hst: parseAsFloat.withDefault(HORIZONTAL_DEFAULTS.hst),
	hsc: parseAsFloat.withDefault(HORIZONTAL_DEFAULTS.hsc),
	hg: parseAsFloat.withDefault(HORIZONTAL_DEFAULTS.hg),
	hit: parseAsBoolean.withDefault(HORIZONTAL_DEFAULTS.hit),
	hsmc: parseAsBoolean.withDefault(HORIZONTAL_DEFAULTS.hsmc),
};

export function useHorizontalParams() {
	return useQueryStates(horizontalParsers, { history: "replace" });
}
