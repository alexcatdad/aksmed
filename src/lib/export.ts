const SVG_NS = "http://www.w3.org/2000/svg";

function extractPrimaryFontFamily(fontFamily: string | null): string | null {
	if (!fontFamily) return null;
	const [primary = ""] = fontFamily.split(",");
	const normalized = primary.trim().replace(/^["']|["']$/g, "");
	return normalized || null;
}

function buildGoogleFontCssUrl(fontFamilies: Iterable<string>): string | null {
	const unique = [...new Set(fontFamilies)].filter(Boolean);
	if (unique.length === 0) return null;

	const familyParams = unique.map((family) => {
		const encoded = encodeURIComponent(family).replace(/%20/g, "+");
		return `family=${encoded}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700`;
	});

	return `https://fonts.googleapis.com/css2?${familyParams.join("&")}&display=swap`;
}

function appendExportStyles(svg: SVGSVGElement): void {
	const textNodes = Array.from(svg.querySelectorAll("text"));
	const families = textNodes
		.map((node) => extractPrimaryFontFamily(node.getAttribute("font-family")))
		.filter((family): family is string => Boolean(family));

	const googleCssUrl = buildGoogleFontCssUrl(families);
	const style = document.createElementNS(SVG_NS, "style");
	style.setAttribute("type", "text/css");

	const styleParts = [
		"svg{shape-rendering:geometricPrecision;text-rendering:geometricPrecision;}",
		"text{font-synthesis:none;}",
	];
	if (googleCssUrl) {
		styleParts.unshift(`@import url("${googleCssUrl}");`);
	}
	style.textContent = styleParts.join("\n");

	svg.insertBefore(style, svg.firstChild);
}

export function downloadSvg(
	svgNode: SVGSVGElement,
	filename: string,
	widthCm?: number,
	heightCm?: number,
): void {
	const clone = svgNode.cloneNode(true) as SVGSVGElement;
	appendExportStyles(clone);
	if (!clone.getAttribute("xmlns")) {
		clone.setAttribute("xmlns", SVG_NS);
	}
	if (!clone.getAttribute("xmlns:xlink")) {
		clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
	}

	if (widthCm && heightCm) {
		clone.setAttribute("width", `${widthCm}cm`);
		clone.setAttribute("height", `${heightCm}cm`);
	} else {
		// Fallback: use viewBox dimensions as px
		const vb = clone.getAttribute("viewBox")?.split(/\s+/).map(Number);
		if (vb && vb.length === 4) {
			clone.setAttribute("width", String(vb[2]));
			clone.setAttribute("height", String(vb[3]));
		}
	}

	const serialized = `<?xml version="1.0" encoding="utf-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
	const blob = new Blob([serialized], {
		type: "image/svg+xml;charset=utf-8",
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
