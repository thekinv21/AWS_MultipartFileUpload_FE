type TRetryOptions = {
	attempts: number
	baseDelayMs: number
	signal: AbortSignal
	shouldRetry: (error: unknown) => boolean
}

/**
 * Runs `mapper` over `items` with at most `limit` calls in flight, keeping the
 * result order. Rejects with the first error.
 */

export async function mapWithConcurrency<T, R>(
	items: T[],
	limit: number,
	mapper: (item: T, index: number) => Promise<R>,
) {
	const results: R[] = new Array(items.length)
	let nextIndex = 0

	const worker = async () => {
		while (nextIndex < items.length) {
			const index = nextIndex++
			results[index] = await mapper(items[index], index)
		}
	}

	await Promise.all(
		Array.from({ length: Math.min(limit, items.length) }, worker),
	)

	return results
}

/**
 * Waits `ms`, or less if `signal` aborts first. It never rejects: the next
 * request sees the aborted signal and fails as a cancel on its own.
 */

function wait(ms: number, signal: AbortSignal) {
	return new Promise<void>(resolve => {
		const timer = setTimeout(done, ms)
		signal.addEventListener('abort', done, { once: true })

		function done() {
			clearTimeout(timer)
			signal.removeEventListener('abort', done)
			resolve()
		}
	})
}

/**
 * Retries `operation` with exponential backoff while `shouldRetry` allows it
 */

export async function withRetry<T>(
	operation: () => Promise<T>,
	{ attempts, baseDelayMs, signal, shouldRetry }: TRetryOptions,
) {
	for (let attempt = 1; ; attempt++) {
		try {
			return await operation()
		} catch (error) {
			if (attempt >= attempts || signal.aborted || !shouldRetry(error)) {
				throw error
			}

			await wait(baseDelayMs * 2 ** (attempt - 1), signal)
		}
	}
}
