import { useState } from '#imports'
import { computed, ref } from 'vue'
import { useApiClient } from '~/presentation/shared/composables/useApiClient'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import type {
    RequestSummary,
    RequestsByStatus,
} from '~/presentation/interfaces/requests/request-summary.interface'
import type { RequestStatus } from '~/presentation/interfaces/requests/request.interface'

const EMPTY_GROUPED = (): RequestsByStatus => ({
    CREATED: [],
    PENDING_DESIGN_REVIEW: [],
    ASSIGNED_TO_DESIGNER: [],
    IN_DESIGN: [],
    SENT_TO_QUALITY: [],
    QUALITY_REJECTED: [],
    QUALITY_APPROVED: [],
    DELIVERED_TO_SALES: [],
    CANCELLED: [],
})

export const useRequestsByStatus = () => {
    const apiClient = useApiClient()
    const toast = useAppToast()
    const grouped = useState<RequestsByStatus>('requests-by-status', EMPTY_GROUPED)
    const isLoading = ref(false)
    const isHydrated = useState<boolean>('requests-by-status-hydrated', () => false)

    const hydrate = async (force = false) => {
        if (isHydrated.value && !force) return
        isLoading.value = true
        try {
            const response = await apiClient.get<RequestsByStatus>('/requests/by-status')
            grouped.value = response.data
            isHydrated.value = true
        } catch {
            toast.error('No se pudo cargar las solicitudes.')
        } finally {
            isLoading.value = false
        }
    }

    const allRequests = computed<RequestSummary[]>(() =>
        (Object.values(grouped.value) as RequestSummary[][]).flat(),
    )

    const totalCount = computed(() => allRequests.value.length)

    const countByStatus = (statuses: RequestStatus[]) =>
        computed(() => statuses.reduce((sum, s) => sum + (grouped.value[s]?.length ?? 0), 0))

    return {
        grouped,
        allRequests,
        totalCount,
        isLoading,
        hydrate,
        countByStatus,
    }
}
