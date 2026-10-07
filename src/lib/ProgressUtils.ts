export type TProgressTracker = (slot: number, loadedBytes: number) => void

/**
 * Keeps the loaded bytes of each slot (a part or a file) and reports their
 * sum on every update. Setting a slot again replaces its value, so a retried
 * part does not count twice.
 */

export function createProgressTracker(
	slotCount: number,
	onProgress: (loadedBytes: number) => void,
): TProgressTracker {
	const loadedBySlot: number[] = new Array(slotCount).fill(0)

	return (slot, loadedBytes) => {
		loadedBySlot[slot] = loadedBytes
		onProgress(loadedBySlot.reduce((total, loaded) => total + loaded, 0))
	}
}

export function toPercent(loaded: number, total: number) {
	return total > 0 ? Math.round((loaded / total) * 100) : 0
}
