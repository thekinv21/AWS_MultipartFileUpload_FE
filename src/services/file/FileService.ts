import axios, { type AxiosRequestConfig } from 'axios'

import type {
	TAbortMultipartUploadRequest,
	TCompleteMultipartUploadRequest,
	TCompleteMultipartUploadResponse,
	TGetPresignedPartUrlRequest,
	TGetPresignedPartUrlResponse,
	TInitiateMultipartUploadRequest,
	TInitiateMultipartUploadResponse,
} from '@/types/file'

import { instance } from '../instance'

class FileService {
	private readonly API_BASE_URL = '/v1/files'

	async initiateMultipartUpload(
		body: TInitiateMultipartUploadRequest,
		config?: AxiosRequestConfig,
	) {
		const { data } = await instance.post<TInitiateMultipartUploadResponse>(
			`${this.API_BASE_URL}/multipart`,
			body,
			config,
		)
		return data
	}

	async getPresignedPartUrl(
		body: TGetPresignedPartUrlRequest,
		config?: AxiosRequestConfig,
	) {
		const { data } = await instance.post<TGetPresignedPartUrlResponse>(
			`${this.API_BASE_URL}/multipart/part-url`,
			body,
			config,
		)
		return data.url
	}

	/**
	 * Sends the part straight to S3 through its presigned URL, so it must not go
	 * through the API instance. The bucket's CORS must expose the ETag header.
	 */

	async uploadPart(url: string, chunk: Blob, config?: AxiosRequestConfig) {
		const { headers } = await axios.put(url, chunk, config)
		const etag = headers.etag

		/**
		 * A setup problem, not something the user can fix: log the hint for the
		 * developer and let the user see the generic failure message
		 */

		if (typeof etag !== 'string' || !etag) {
			console.error(
				'S3 did not expose the ETag header. Add "ETag" to the bucket CORS ExposeHeaders.',
			)
			throw new Error('Missing ETag in the S3 part upload response')
		}

		return etag
	}

	async completeMultipartUpload(
		body: TCompleteMultipartUploadRequest,
		config?: AxiosRequestConfig,
	) {
		const { data } = await instance.post<TCompleteMultipartUploadResponse>(
			`${this.API_BASE_URL}/multipart/complete`,
			body,
			config,
		)
		return data
	}

	async abortMultipartUpload(body: TAbortMultipartUploadRequest) {
		await instance.post(`${this.API_BASE_URL}/multipart/abort`, body)
	}
}

export const fileService = new FileService()
