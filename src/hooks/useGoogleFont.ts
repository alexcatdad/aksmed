import { useEffect, useRef } from "react";
import { FONT_OPTIONS } from "../constants/fonts";

const loadedFonts = new Set(["Cormorant Garamond"]);

function buildGoogleFontHref(family: string): string {
	const familyParam = encodeURIComponent(family).replace(/%20/g, "+");
	return `https://fonts.googleapis.com/css2?family=${familyParam}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap`;
}

function ensureGoogleFontLoaded(family: string): void {
	if (!family || loadedFonts.has(family)) return;
	const id = `gf-${family.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
	if (document.getElementById(id)) {
		loadedFonts.add(family);
		return;
	}
	const link = document.createElement("link");
	link.id = id;
	link.rel = "stylesheet";
	link.href = buildGoogleFontHref(family);
	document.head.appendChild(link);
	loadedFonts.add(family);
}

export function useGoogleFont(fontCss: string): void {
	const prevRef = useRef(fontCss);

	useEffect(() => {
		prevRef.current = fontCss;
		const opt = FONT_OPTIONS.find((f) => f.css === fontCss);
		if (opt?.google) {
			ensureGoogleFontLoaded(opt.google);
		}
	}, [fontCss]);
}
