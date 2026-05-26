import { useState } from '#imports'
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { useApiClient } from '~/presentation/shared/composables/useApiClient'
import { useRequestWorkflowStore } from '~/presentation/request-workflow/stores/useRequestWorkflowStore'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import type { HttpClientError } from '~/presentation/interfaces/shared/http/http-client-error.interface'
import type { DesignRequestFormModel } from '~/presentation/interfaces/requests/request-form.interface'
import type {
    DesignRequest,
    RequestAttachment,
} from '~/presentation/interfaces/requests/request.interface'
import type { DesignRequestTableRow } from '~/presentation/interfaces/requests/request-table-row.interface'
import { downloadCsvFile } from '~/utils/csv/download-csv.util'

const formatDateLabel = (dateValue: string) => {
    if (!dateValue) {
        return 'Sin fecha'
    }

    const parsedDate = dayjs(dateValue)

    if (!parsedDate.isValid()) {
        return 'Fecha inválida'
    }

    return new Intl.DateTimeFormat('es-SV', { dateStyle: 'medium' }).format(parsedDate.toDate())
}

const toSafeNumber = (value: string) => {
    const parsedNumber = Number(value)

    if (Number.isNaN(parsedNumber) || parsedNumber <= 0) {
        return 0
    }

    return Math.floor(parsedNumber)
}

export const createEmptyRequestFormModel = (): DesignRequestFormModel => ({
    clientName: '',
    brandName: '',
    productName: '',
    requestedBy: '',
    vendorName: '',
    materialType: '',
    materialWeight: '',
    fluteDirection: 'Vertical',
    outerLiner: '',
    innerLiner: '',
    printTechnique: '',
    colorMode: '',
    pantoneReferences: '',
    finishingOptions: [],
    deliverables: [],
    dimensions: '',
    quantity: '',
    requiredDate: '',
    priority: 'Media',
    status: 'PENDING_ASSIGNMENT',
    designInstructions: '',
    visualReferences: '',
    requireArt: true,
    requireDieCut: false,
    requireMockup: false,
    attachments: [],
})

const toRequestFormModel = (request: DesignRequest): DesignRequestFormModel => ({
    clientName: request.clientName,
    brandName: request.brandName,
    productName: request.productName,
    requestedBy: request.requestedBy,
    vendorName: request.vendorName,
    materialType: request.materialType,
    materialWeight: request.materialWeight,
    fluteDirection: request.fluteDirection,
    outerLiner: request.outerLiner,
    innerLiner: request.innerLiner,
    printTechnique: request.printTechnique,
    colorMode: request.colorMode,
    pantoneReferences: request.pantoneReferences,
    finishingOptions: [...request.finishingOptions],
    deliverables: [...request.deliverables],
    dimensions: request.dimensions,
    quantity: request.quantity.toString(),
    requiredDate: request.requiredDate,
    priority: request.priority,
    status: request.status,
    designInstructions: request.designInstructions,
    visualReferences: request.visualReferences,
    requireArt: request.requireArt,
    requireDieCut: request.requireDieCut,
    requireMockup: request.requireMockup,
    attachments: [...request.attachments],
})

const toRequestPayload = (sourceModel: DesignRequestFormModel) => ({
    clientName: sourceModel.clientName.trim(),
    brandName: sourceModel.brandName.trim(),
    productName: sourceModel.productName.trim(),
    requestedBy: sourceModel.requestedBy.trim(),
    vendorName: sourceModel.vendorName.trim(),
    materialType: sourceModel.materialType,
    materialWeight: sourceModel.materialWeight.trim(),
    fluteDirection: sourceModel.fluteDirection.trim(),
    outerLiner: sourceModel.outerLiner.trim(),
    innerLiner: sourceModel.innerLiner.trim(),
    printTechnique: sourceModel.printTechnique,
    colorMode: sourceModel.colorMode,
    pantoneReferences: sourceModel.pantoneReferences.trim(),
    finishingOptions: [...sourceModel.finishingOptions],
    deliverables: [...sourceModel.deliverables],
    dimensions: sourceModel.dimensions.trim(),
    quantity: toSafeNumber(sourceModel.quantity),
    requiredDate: sourceModel.requiredDate,
    priority: sourceModel.priority,
    status: sourceModel.status,
    designInstructions: sourceModel.designInstructions.trim(),
    visualReferences: sourceModel.visualReferences.trim(),
    requireArt: sourceModel.requireArt,
    requireDieCut: sourceModel.requireDieCut,
    requireMockup: sourceModel.requireMockup,
    attachments: [...sourceModel.attachments],
})

const getAttachmentId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID()
    }

    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

export const toRequestAttachmentFromFile = (file: File): RequestAttachment => {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? 'archivo'
    const sizeKb = Math.max(1, Math.round(file.size / 1024))

    return {
        id: `att-${getAttachmentId()}`,
        name: file.name,
        extension,
        sizeKb,
    }
}

let hydratePromise: Promise<void> | null = null

export const useRequestsModule = () => {
    const apiClient = useApiClient()
    const toast = useAppToast()
    const workflowStore = useRequestWorkflowStore()
    const requests = useState<DesignRequest[]>('requests-module-list', () => [])
    const isHydrated = useState<boolean>('requests-module-hydrated', () => false)
    const importInputRef = ref<HTMLInputElement | null>(null)

    const hydrateRequests = async (force = false) => {
        if (isHydrated.value && !force) {
            return
        }

        if (hydratePromise && !force) {
            await hydratePromise
            return
        }

        hydratePromise = (async () => {
            const response = await apiClient.get<DesignRequest[]>('/requests')
            requests.value = response.data
            workflowStore.requests = []
            response.data.forEach((request) => workflowStore.upsertFromDesignRequest(request))
            workflowStore.hydrated = true
            isHydrated.value = true
        })()

        try {
            await hydratePromise
        } finally {
            hydratePromise = null
        }
    }

    const totalRequests = computed(() => requests.value.length)
    const pendingAssignmentRequests = computed(
        () => requests.value.filter((request) => request.status === 'PENDING_ASSIGNMENT').length,
    )
    const inDesignRequests = computed(
        () => requests.value.filter((request) => request.status === 'IN_DESIGN').length,
    )
    const highPriorityRequests = computed(
        () => requests.value.filter((request) => request.priority === 'Alta').length,
    )

    const tableRows = computed<DesignRequestTableRow[]>(() => {
        return requests.value.map((request) => ({
            id: request.id,
            requestCode: request.requestCode,
            clientName: request.clientName,
            productName: request.productName,
            materialType: request.materialType,
            printTechnique: request.printTechnique,
            priority: request.priority,
            status: request.status,
            currentVersion: request.currentVersion ?? 1,
            assignedDesignerId: request.assignedDesignerId ?? null,
            requiredDateLabel: formatDateLabel(request.requiredDate),
            attachmentsCount: request.attachments.length.toString(),
            requestedBy: request.requestedBy,
        }))
    })

    const findRequestById = (requestId: string) => {
        return requests.value.find((request) => request.id === requestId) ?? null
    }

    const getFormModelById = (requestId: string): DesignRequestFormModel | null => {
        const request = findRequestById(requestId)

        if (!request) {
            return null
        }

        return toRequestFormModel(request)
    }

    const createRequest = async (formModel: DesignRequestFormModel) => {
        try {
            const response = await apiClient.post<DesignRequest>(
                '/requests',
                toRequestPayload(formModel),
            )
            requests.value = [response.data, ...requests.value]
            workflowStore.upsertFromDesignRequest(response.data)
            toast.success(`Solicitud creada: ${response.data.requestCode}`)
            return true
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || 'No se pudo crear la solicitud.')
            return false
        }
    }

    const updateRequest = async (requestId: string, formModel: DesignRequestFormModel) => {
        const existingRequest = findRequestById(requestId)

        if (!existingRequest) {
            toast.error('No se encontró la solicitud seleccionada.')
            return false
        }

        try {
            const response = await apiClient.put<DesignRequest>(`/requests/${requestId}`, {
                ...toRequestPayload(formModel),
                requestCode: existingRequest.requestCode,
            })

            requests.value = requests.value.map((request) => {
                if (request.id !== requestId) {
                    return request
                }

                return response.data
            })
            workflowStore.upsertFromDesignRequest(response.data)

            toast.success(`Solicitud actualizada: ${existingRequest.requestCode}`)
            return true
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || 'No se pudo actualizar la solicitud.')
            return false
        }
    }

    const removeRequest = async (requestId: string) => {
        const request = findRequestById(requestId)

        if (!request) {
            toast.error('No se encontró la solicitud seleccionada.')
            return
        }

        const shouldRemove = window.confirm(`¿Deseas eliminar la solicitud ${request.requestCode}?`)

        if (!shouldRemove) {
            return
        }

        try {
            await apiClient.delete(`/requests/${requestId}`)
            requests.value = requests.value.filter((item) => item.id !== requestId)
            workflowStore.removeByRequestId(requestId)
            toast.success(`Solicitud eliminada: ${request.requestCode}`)
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || 'No se pudo eliminar la solicitud.')
        }
    }

    const assignDesigner = async (requestId: string, designerId: string) => {
        const request = findRequestById(requestId)

        if (!request) {
            toast.error('No se encontró la solicitud seleccionada.')
            return false
        }

        try {
            const response = await apiClient.post<DesignRequest>(`/requests/${requestId}/assign`, {
                designerId,
            })
            requests.value = requests.value.map((item) =>
                item.id === requestId ? response.data : item,
            )
            workflowStore.upsertFromDesignRequest(response.data)
            toast.success(`Solicitud asignada: ${response.data.requestCode}`)
            return true
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || 'No se pudo asignar la solicitud.')
            return false
        }
    }

    const submitToQuality = async (requestId: string, notes = '') => {
        const request = findRequestById(requestId)

        if (!request) {
            toast.error('No se encontró la solicitud seleccionada.')
            return false
        }

        try {
            const response = await apiClient.post<DesignRequest>(
                `/requests/${requestId}/submit-to-quality`,
                { notes },
            )
            requests.value = requests.value.map((item) =>
                item.id === requestId ? response.data : item,
            )
            workflowStore.upsertFromDesignRequest(response.data)
            toast.success(`Solicitud enviada a calidad: ${response.data.requestCode}`)
            return true
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || 'No se pudo enviar a calidad.')
            return false
        }
    }

    const approveRequest = async (requestId: string, comments = '') => {
        const request = findRequestById(requestId)

        if (!request) {
            toast.error('No se encontró la solicitud seleccionada.')
            return false
        }

        try {
            const response = await apiClient.post<DesignRequest>(`/requests/${requestId}/approve`, {
                comments,
            })
            requests.value = requests.value.map((item) =>
                item.id === requestId ? response.data : item,
            )
            workflowStore.upsertFromDesignRequest(response.data)
            toast.success(`Solicitud aprobada: ${response.data.requestCode}`)
            return true
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || 'No se pudo aprobar la solicitud.')
            return false
        }
    }

    const rejectRequest = async (requestId: string, rejectionReason: string, comments = '') => {
        const request = findRequestById(requestId)

        if (!request) {
            toast.error('No se encontró la solicitud seleccionada.')
            return false
        }

        try {
            const response = await apiClient.post<DesignRequest>(`/requests/${requestId}/reject`, {
                rejectionReason,
                comments,
            })
            requests.value = requests.value.map((item) =>
                item.id === requestId ? response.data : item,
            )
            workflowStore.upsertFromDesignRequest(response.data)
            toast.success(
                `Solicitud rechazada (v${response.data.currentVersion}): ${response.data.requestCode}`,
            )
            return true
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || 'No se pudo rechazar la solicitud.')
            return false
        }
    }

    const duplicateRequest = async (requestId: string) => {
        const request = findRequestById(requestId)

        if (!request) {
            toast.error('No se encontró la solicitud seleccionada.')
            return
        }

        const duplicatedPayload: DesignRequestFormModel = {
            ...toRequestFormModel(request),
            status: 'PENDING_ASSIGNMENT',
        }

        await createRequest({
            ...duplicatedPayload,
            status: 'PENDING_ASSIGNMENT',
        })
    }

    const triggerImport = () => {
        importInputRef.value?.click()
    }

    const handleImportSelection = (event: Event) => {
        const target = event.target as HTMLInputElement
        const selectedFile = target.files?.[0]

        if (!selectedFile) {
            return
        }

        toast.info(
            `Archivo seleccionado: ${selectedFile.name}. Integración de importación pendiente.`,
        )
        target.value = ''
    }

    const exportRequests = () => {
        if (!tableRows.value.length) {
            toast.warning('No hay solicitudes para exportar.')
            return
        }

        downloadCsvFile(
            'solicitudes.csv',
            [
                { key: 'requestCode', label: 'Solicitud' },
                { key: 'clientName', label: 'Cliente' },
                { key: 'productName', label: 'Producto' },
                { key: 'materialType', label: 'Material' },
                { key: 'printTechnique', label: 'Técnica' },
                { key: 'priority', label: 'Prioridad' },
                { key: 'status', label: 'Estado' },
                { key: 'requiredDateLabel', label: 'Entrega solicitada' },
                { key: 'attachmentsCount', label: 'Adjuntos' },
                { key: 'requestedBy', label: 'Solicitado por' },
            ],
            tableRows.value,
        )

        toast.success('Exportación de solicitudes completada.')
    }

    return {
        importInputRef,
        totalRequests,
        pendingAssignmentRequests,
        inDesignRequests,
        highPriorityRequests,
        tableRows,
        createRequest,
        updateRequest,
        removeRequest,
        duplicateRequest,
        assignDesigner,
        submitToQuality,
        approveRequest,
        rejectRequest,
        findRequestById,
        getFormModelById,
        triggerImport,
        handleImportSelection,
        exportRequests,
        hydrateRequests,
    }
}
