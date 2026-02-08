import { parseAsFloat, parseAsString, useQueryStates } from "nuqs";
import { PAINT_DEFAULTS } from "../constants/defaults";

const paintParsers = {
	pm: parseAsString.withDefault(PAINT_DEFAULTS.pm),
	gl: parseAsFloat.withDefault(PAINT_DEFAULTS.gl),
	gd: parseAsFloat.withDefault(PAINT_DEFAULTS.gd),
	bc: parseAsString.withDefault(PAINT_DEFAULTS.bc),
};

export function usePaintParams() {
	return useQueryStates(paintParsers, { history: "replace" });
}
