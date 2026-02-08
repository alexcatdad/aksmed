import { useCallback, useState } from "react";
import type { VersionSnapshot } from "../types";

const STORAGE_KEY = "aksmed-versions";

function loadVersions(): VersionSnapshot[] {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			if (Array.isArray(parsed)) return parsed;
		}
	} catch {}
	return [];
}

function saveVersions(versions: VersionSnapshot[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
	} catch {}
}

export function useVersionHistory(
	getCurrentParams: () => Record<string, string | number | boolean>,
	applyParams: (params: Record<string, string | number | boolean>) => void,
) {
	const [versions, setVersions] = useState<VersionSnapshot[]>(loadVersions);
	const [currentIndex, setCurrentIndex] = useState(() => {
		const v = loadVersions();
		return v.length > 0 ? v.length - 1 : -1;
	});

	const saveVersion = useCallback(() => {
		const params = getCurrentParams();
		const version: VersionSnapshot = {
			params,
			timestamp: Date.now(),
			label: `v${versions.length + 1}`,
		};
		const next = [...versions, version];
		setVersions(next);
		setCurrentIndex(next.length - 1);
		saveVersions(next);
	}, [versions, getCurrentParams]);

	const goToVersion = useCallback(
		(index: number) => {
			if (index < 0 || index >= versions.length) return;
			setCurrentIndex(index);
			applyParams(versions[index].params);
		},
		[versions, applyParams],
	);

	const goPrev = useCallback(() => {
		if (currentIndex > 0) {
			goToVersion(currentIndex - 1);
		} else if (currentIndex === -1 && versions.length > 0) {
			goToVersion(versions.length - 1);
		}
	}, [currentIndex, versions.length, goToVersion]);

	const goNext = useCallback(() => {
		if (currentIndex >= 0 && currentIndex < versions.length - 1) {
			goToVersion(currentIndex + 1);
		}
	}, [currentIndex, versions.length, goToVersion]);

	const clearAll = useCallback(() => {
		setVersions([]);
		setCurrentIndex(-1);
		saveVersions([]);
	}, []);

	const total = versions.length;
	const displayIndex = currentIndex >= 0 ? currentIndex + 1 : total;
	const canPrev = currentIndex > 0 || (currentIndex === -1 && total > 0);
	const canNext = currentIndex >= 0 && currentIndex < total - 1;

	return {
		total,
		displayIndex,
		canPrev,
		canNext,
		saveVersion,
		goPrev,
		goNext,
		clearAll,
	};
}
