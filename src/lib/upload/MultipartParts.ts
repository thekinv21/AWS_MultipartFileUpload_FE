import { fileService } from '@/services/file'
import { isRetryableRequestError } from '@/services/instance'

import type { TCompletedPart, TUploadPartsOptions } from '@/types/file'

import { mapWithConcurrency, withRetry } from '@/lib/PromiseUtils'

const PART_CONCURRENCY: number = 4

const PART_RETRY_ATTEMPTS: number = 3

const PART_RETRY_BASE_DELAY_MS: number = 1000

/**
 * Uploads every chunk, PART_CONCURRENCY at a time, retrying network and
 * server failures. Rejects with the first part that still fails.
 */

export function uploadParts(chunks: Blob[], options: TUploadPartsOptions) {
	return mapWithConcurrency(chunks, PART_CONCURRENCY, (chunk, index) =>
		withRetry(() => uploadPart(chunk, index, options), {
			attempts: PART_RETRY_ATTEMPTS,
			baseDelayMs: PART_RETRY_BASE_DELAY_MS,
			signal: options.signal,
			shouldRetry: isRetryableRequestError,
		}),
	)
}

/**
 * part-url → PUT to S3 for a single chunk. Progress restarts from 0 on each
 * attempt, so a retry does not count the failed bytes.
 */

async function uploadPart(
	chunk: Blob,
	index: number,
	{ target, signal, onPartProgress }: TUploadPartsOptions,
): Promise<TCompletedPart> {
	const partNumber = index + 1

	const url = await fileService.getPresignedPartUrl(
		{ ...target, partNumber },
		{ signal },
	)

	onPartProgress(index, 0)

	const etag = await fileService.uploadPart(url, chunk, {
		signal,
		onUploadProgress: ({ loaded }) => onPartProgress(index, loaded),
	})

	onPartProgress(index, chunk.size)

	return { PartNumber: partNumber, ETag: assertEtag(etag) }
}

/**
 * A missing ETag is a setup problem, not something the user can fix: log the
 * hint for the developer and let the user see the generic failure message
 */

function assertEtag(etag: unknown) {
	if (typeof etag !== 'string' || !etag) {
		console.error(
			'S3 did not expose the ETag header. Add "ETag" to the bucket CORS ExposeHeaders.',
		)
		throw new Error('Missing ETag in the S3 part upload response')
	}

	return etag
}
