import type { TCompletedPart, TUploadPartsOptions } from '@/types/file'

import { mapWithConcurrency, withRetry } from '@/lib/PromiseUtils'

import { isRetryableRequestError } from '../instance'
import { fileService } from './FileService'

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

	return { PartNumber: partNumber, ETag: etag }
}
