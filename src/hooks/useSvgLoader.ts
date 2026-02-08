import { useCallback, useEffect, useState } from "react";
import { fetchSvg, parseSvg } from "../lib/svg-utils";

interface SvgTemplates {
	editableSvg: SVGSVGElement | null;
	symbolSvg: SVGSVGElement | null;
	loading: boolean;
	error: string | null;
	reload: () => void;
}

export function useSvgLoader(): SvgTemplates {
	const [editableSvg, setEditableSvg] = useState<SVGSVGElement | null>(null);
	const [symbolSvg, setSymbolSvg] = useState<SVGSVGElement | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		const base = import.meta.env.BASE_URL;
		setLoading(true);
		setError(null);
		try {
			const [editableText, symbolText] = await Promise.all([
				fetchSvg(`${base}logo-editable.svg`),
				fetchSvg(`${base}logo-symbol.svg`),
			]);
			const editable = parseSvg(editableText);
			const symbol = parseSvg(symbolText);
			setEditableSvg(document.importNode(editable, true) as unknown as SVGSVGElement);
			setSymbolSvg(document.importNode(symbol, true) as unknown as SVGSVGElement);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load SVGs");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	return { editableSvg, symbolSvg, loading, error, reload: load };
}
