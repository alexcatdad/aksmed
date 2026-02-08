import { parseViewBox } from "./svg-utils";

export function downloadSvg(svgNode: SVGSVGElement, filename: string): void {
	let bbox: DOMRect | null;
	try {
		bbox = svgNode.getBBox();
	} catch {
		bbox = null;
	}

	const clone = svgNode.cloneNode(true) as SVGSVGElement;
	if (!clone.getAttribute("xmlns")) {
		clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	}
	if (!clone.getAttribute("xmlns:xlink")) {
		clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
	}

	const padX = 60;
	const padY = 40;
	let vbX: number;
	let vbY: number;
	let vbW: number;
	let vbH: number;

	if (bbox && bbox.width > 0 && bbox.height > 0) {
		vbX = Math.floor(bbox.x - padX);
		vbY = Math.floor(bbox.y - padY);
		vbW = Math.ceil(bbox.width + padX * 2);
		vbH = Math.ceil(bbox.height + padY * 2);
	} else {
		const vb = parseViewBox(clone);
		vbX = vb.x;
		vbY = vb.y;
		vbW = vb.width;
		vbH = vb.height;
	}

	clone.setAttribute("viewBox", `${vbX} ${vbY} ${vbW} ${vbH}`);
	clone.setAttribute("width", String(vbW));
	clone.setAttribute("height", String(vbH));

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
