export type TLinkedAbortController = {
	signal: AbortSignal
	abort: () => void
	dispose: () => void
}

export function createLinkedAbortController(
	parent: AbortSignal,
): TLinkedAbortController {
	const controller = new AbortController()
	const abort = () => controller.abort()

	if (parent.aborted) abort()
	else parent.addEventListener('abort', abort, { once: true })

	return {
		signal: controller.signal,
		abort,
		dispose: () => parent.removeEventListener('abort', abort),
	}
}
