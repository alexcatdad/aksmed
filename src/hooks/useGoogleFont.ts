import { useEffect, useRef } from "react";
import { FONT_OPTIONS } from "../constants/fonts";

const loadedFonts = new Set(["Cormorant Garamond"]);

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
	const familyParam = encodeURIComponent(family).replace(/%20/g, "+");
	link.href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@300;400;500;600;700&display=swap`;
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
