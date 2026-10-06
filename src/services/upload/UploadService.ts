import axios, { type AxiosRequestConfig } from 'axios'

import type {
	TAbortMultipartRequest,
	TCompleteMultipartRequest,
	TCompleteMultipartResponse,
	TGetPartUrlRequest,
	TGetPartUrlResponse,
	TInitiateMultipartRequest,
	TInitiateMultipartResponse,
} from '@/types/upload'

import { instance } from '../instance'

class UploadService {
	private readonly API_BASE_URL = '/v1/upload'

	async initiateMultipart(
		body: TInitiateMultipartRequest,
		config?: AxiosRequestConfig,
	) {
		const { data } = await instance.post<TInitiateMultipartResponse>(
			`${this.API_BASE_URL}/initiate-multipart`,
			body,
			config,
		)
		return data
	}

	async getPartUrl(body: TGetPartUrlRequest, config?: AxiosRequestConfig) {
		const { data } = await instance.post<TGetPartUrlResponse>(
			`${this.API_BASE_URL}/part-url`,
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

	async completeMultipart(
		body: TCompleteMultipartRequest,
		config?: AxiosRequestConfig,
	) {
		const { data } = await instance.post<TCompleteMultipartResponse>(
			`${this.API_BASE_URL}/complete-multipart`,
			body,
			config,
		)
		return data
	}

	async abortMultipart(body: TAbortMultipartRequest) {
		await instance.post(`${this.API_BASE_URL}/abort-multipart`, body)
	}
}

export const uploadService = new UploadService()
