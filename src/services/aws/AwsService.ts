import type { AxiosRequestConfig } from 'axios'

import { instance } from '../instance'

class AwsService {
	private API_BASE_URL = 'aws'

	async singleUpload(formData: FormData, config?: AxiosRequestConfig) {
		const { data } = await instance.post(
			`/v1/${this.API_BASE_URL}/s3-single-upload`,
			formData,
			config,
		)
		return data
	}

	async multiUpload(formData: FormData, config?: AxiosRequestConfig) {
		const { data } = await instance.post(
			`/v1/${this.API_BASE_URL}/s3-multi-upload`,
			formData,
			config,
		)
		return data
	}
}

export const awsService = new AwsService()
