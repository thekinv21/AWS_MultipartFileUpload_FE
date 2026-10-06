import { instance } from '../instance'

class AwsService {
	private API_BASE_URL = '/aws'

	async singleUpload(formData: FormData) {
		return instance.post(`/v1/${this.API_BASE_URL}/s3-single-upload`, formData)
	}

	async multiUpload(formData: FormData) {
		return instance.post(`/v1/${this.API_BASE_URL}/s3-multi-upload`, formData)
	}
}

export const awsService = new AwsService()
