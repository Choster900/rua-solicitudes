import { useState } from '#imports'
import { useApiClient } from '~/presentation/shared/composables/useApiClient'

export interface SessionUserInfo {
    id: string
    email: string
    employeeCode: string
    userType: string
    mustChangePassword: boolean
}

const DESIGN_LEAD_USER_TYPES = ['Administrador', 'JefeDiseño']

let hydratePromise: Promise<SessionUserInfo | null> | null = null

export const useSessionUser = () => {
    const apiClient = useApiClient()
    const sessionUser = useState<SessionUserInfo | null>('session-user', () => null)

    const hydrateSession = async (force = false) => {
        if (sessionUser.value && !force) {
            return sessionUser.value
        }

        if (hydratePromise && !force) {
            return hydratePromise
        }

        hydratePromise = (async () => {
            try {
                const response = await apiClient.get<SessionUserInfo>('/auth/me')
                sessionUser.value = response.data
                return response.data
            } catch {
                sessionUser.value = null
                return null
            }
        })()

        try {
            return await hydratePromise
        } finally {
            hydratePromise = null
        }
    }

    const isDesignLead = () => DESIGN_LEAD_USER_TYPES.includes(sessionUser.value?.userType ?? '')
    const isDesigner = () => sessionUser.value?.userType === 'Diseñador'
    const isVendor = () => sessionUser.value?.userType === 'Vendedor'
    const isQuality = () =>
        sessionUser.value?.userType === 'Calidad' || sessionUser.value?.userType === 'Administrador'

    return {
        sessionUser,
        hydrateSession,
        isDesignLead,
        isDesigner,
        isVendor,
        isQuality,
    }
}
