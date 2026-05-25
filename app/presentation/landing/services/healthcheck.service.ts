import type { AxiosInstance } from 'axios'
import type { HealthcheckResponse } from '~/presentation/interfaces/landing/healthcheck-response.interface'

export async function getHealthcheck(client: AxiosInstance): Promise<HealthcheckResponse> {
    const response = await client.get<HealthcheckResponse>('/healthcheck')
    return response.data
}
