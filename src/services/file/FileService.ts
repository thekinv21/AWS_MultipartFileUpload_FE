import axios, { type AxiosRequestConfig } from 'axios'

import type {
	TAbortMultipartUploadRequest,
	TCompleteMultipartUploadRequest,
	TCompleteMultipartUploadResponse,
	TGetDownloadUrlRequest,
	TGetDownloadUrlResponse,
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
		const {
			data: { url },
		} = await instance.post<TGetPresignedPartUrlResponse>(
			`${this.API_BASE_URL}/multipart/part-url`,
			body,
			config,
		)
		return url
	}

	/**
	 * Sends the part straight to S3 through its presigned URL, so it must not go
	 * through the API instance. The bucket's CORS must expose the ETag header.
	 */

	async uploadPart(url: string, chunk: Blob, config?: AxiosRequestConfig) {
		const {
			headers: { etag },
		} = await axios.put(url, chunk, config)
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

	/**
	 * Presigned download URL for a stored file, public or private. The file is
	 * saved under its original name.
	 */

	async getDownloadUrl(
		params: TGetDownloadUrlRequest,
		config?: AxiosRequestConfig,
	) {
		const {
			data: { url },
		} = await instance.get<TGetDownloadUrlResponse>(
			`${this.API_BASE_URL}/download-url`,
			{ ...config, params },
		)
		return url
	}
}

export const fileService = new FileService()
