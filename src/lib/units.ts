/** SVG units per centimeter — defines the mapping from physical to SVG coordinate space */
export const UNITS_PER_CM = 50;

/** Convert a percentage of document width to SVG units */
export function pct(percent: number, widthUnits: number): number {
	return (percent / 100) * widthUnits;
}

/** Convert centimeters to SVG units */
export function cm(value: number): number {
	return value * UNITS_PER_CM;
}
