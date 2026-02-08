export function downloadSvg(
	svgNode: SVGSVGElement,
	filename: string,
	widthCm?: number,
	heightCm?: number,
): void {
	const clone = svgNode.cloneNode(true) as SVGSVGElement;
	if (!clone.getAttribute("xmlns")) {
		clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
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
