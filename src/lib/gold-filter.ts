const NS = "http://www.w3.org/2000/svg";

function createNS(tag: string): SVGElement {
	return document.createElementNS(NS, tag) as SVGElement;
}

function setAttrs(el: SVGElement, attrs: Record<string, string>): void {
	for (const [k, v] of Object.entries(attrs)) {
		el.setAttribute(k, v);
	}
}

export function ensureGoldDefs(svgRoot: SVGSVGElement, lightness: number, darkness: number): void {
	let defs = svgRoot.querySelector("defs") as SVGElement | null;
	if (!defs) {
		defs = createNS("defs");
		svgRoot.insertBefore(defs, svgRoot.firstChild);
	}

	defs!.querySelector("#gold-metal-filter")?.remove();

	const shine = lightness / 100;
	const depth = darkness / 100;
	const surfaceScale = 2.5 + shine * 3.5;
	const specConstant = 0.5 + shine * 0.6;
	const specExponent = 25 + shine * 35;
	const diffuseConstant = 0.6 + depth * 0.4;

	const filter = createNS("filter");
	setAttrs(filter, {
		id: "gold-metal-filter",
		x: "-20%",
		y: "-20%",
		width: "140%",
		height: "140%",
		"color-interpolation-filters": "sRGB",
	});

	// Gold base color transformation
	const colorMatrix = createNS("feColorMatrix");
	setAttrs(colorMatrix, {
		in: "SourceGraphic",
		type: "matrix",
		values: `
			1.2  0.1  0    0  0.05
			0.95 0.8  0.1  0  0.02
			0.2  0.3  0.2  0  0
			0    0    0    1  0
		`,
		result: "goldBase",
	});
	filter.appendChild(colorMatrix);

	// Blur for lighting calculations
	const blur = createNS("feGaussianBlur");
	setAttrs(blur, { in: "SourceAlpha", stdDeviation: "2", result: "blur" });
	filter.appendChild(blur);

	// Primary specular highlight
	const spec1 = createNS("feSpecularLighting");
	setAttrs(spec1, {
		in: "blur",
		surfaceScale: String(surfaceScale),
		specularConstant: String(specConstant),
		specularExponent: String(Math.round(specExponent)),
		"lighting-color": "#FFFEF0",
		result: "spec1",
	});
	const light1 = createNS("feDistantLight");
	setAttrs(light1, { azimuth: "225", elevation: "55" });
	spec1.appendChild(light1);
	filter.appendChild(spec1);

	// Secondary specular (fill light)
	const spec2 = createNS("feSpecularLighting");
	setAttrs(spec2, {
		in: "blur",
		surfaceScale: String(surfaceScale * 0.5),
		specularConstant: String(specConstant * 0.5),
		specularExponent: String(Math.round(specExponent * 1.5)),
		"lighting-color": "#FFE4B5",
		result: "spec2",
	});
	const light2 = createNS("feDistantLight");
	setAttrs(light2, { azimuth: "45", elevation: "35" });
	spec2.appendChild(light2);
	filter.appendChild(spec2);

	// Diffuse lighting for body color
	const diffuse = createNS("feDiffuseLighting");
	setAttrs(diffuse, {
		in: "blur",
		surfaceScale: String(surfaceScale * 0.8),
		diffuseConstant: String(diffuseConstant),
		"lighting-color": "#DAA520",
		result: "diffuse",
	});
	const light3 = createNS("feDistantLight");
	setAttrs(light3, { azimuth: "135", elevation: "45" });
	diffuse.appendChild(light3);
	filter.appendChild(diffuse);

	// Combine diffuse with gold base
	const comp1 = createNS("feComposite");
	setAttrs(comp1, {
		in: "diffuse",
		in2: "goldBase",
		operator: "arithmetic",
		k1: "0.3",
		k2: "0.6",
		k3: "0.4",
		k4: "0",
		result: "lit",
	});
	filter.appendChild(comp1);

	// Add primary specular
	const comp2 = createNS("feComposite");
	setAttrs(comp2, {
		in: "spec1",
		in2: "lit",
		operator: "arithmetic",
		k1: "0",
		k2: "1",
		k3: String(0.4 + shine * 0.3),
		k4: "0",
		result: "shiny1",
	});
	filter.appendChild(comp2);

	// Add secondary specular
	const comp3 = createNS("feComposite");
	setAttrs(comp3, {
		in: "spec2",
		in2: "shiny1",
		operator: "arithmetic",
		k1: "0",
		k2: "1",
		k3: "0.25",
		k4: "0",
		result: "shiny2",
	});
	filter.appendChild(comp3);

	// Clip to original shape
	const clip = createNS("feComposite");
	setAttrs(clip, {
		in: "shiny2",
		in2: "SourceAlpha",
		operator: "in",
		result: "clipped",
	});
	filter.appendChild(clip);

	// Subtle drop shadow
	const shadowBlur = createNS("feGaussianBlur");
	setAttrs(shadowBlur, {
		in: "SourceAlpha",
		stdDeviation: "1.5",
		result: "shadowBlur",
	});
	filter.appendChild(shadowBlur);

	const shadowOffset = createNS("feOffset");
	setAttrs(shadowOffset, {
		in: "shadowBlur",
		dx: "0.5",
		dy: "1",
		result: "shadowOffset",
	});
	filter.appendChild(shadowOffset);

	const shadowColor = createNS("feFlood");
	setAttrs(shadowColor, {
		"flood-color": "#3D2E00",
		"flood-opacity": String(0.15 + depth * 0.2),
		result: "shadowColor",
	});
	filter.appendChild(shadowColor);

	const shadowComp = createNS("feComposite");
	setAttrs(shadowComp, {
		in: "shadowColor",
		in2: "shadowOffset",
		operator: "in",
		result: "shadow",
	});
	filter.appendChild(shadowComp);

	// Final merge
	const merge = createNS("feMerge");
	const m1 = createNS("feMergeNode");
	m1.setAttribute("in", "shadow");
	merge.appendChild(m1);
	const m2 = createNS("feMergeNode");
	m2.setAttribute("in", "clipped");
	merge.appendChild(m2);
	filter.appendChild(merge);

	defs!.appendChild(filter);
}
