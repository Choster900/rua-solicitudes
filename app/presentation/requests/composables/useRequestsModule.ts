import { useState } from '#imports'
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { useApiClient } from '~/presentation/shared/composables/useApiClient'
import { useRequestWorkflowStore } from '~/presentation/request-workflow/stores/useRequestWorkflowStore'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import { authTokenHasRole, getAuthTokenUserId } from '~/presentation/auth/utils/auth-token.util'
import type { HttpClientError } from '~/presentation/interfaces/shared/http/http-client-error.interface'
import type { DesignRequestFormModel } from '~/presentation/interfaces/requests/request-form.interface'
import type {
    DesignRequest,
    RequestStatus,
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

const toRequestCode = (sequence: number) => {
    const year = dayjs().year()
    const paddedSequence = sequence.toString().padStart(3, '0')

    return `SOL-${year}-${paddedSequence}`
}

const toSafeNumber = (value: string) => {
    const parsedNumber = Number(value)

    if (Number.isNaN(parsedNumber) || parsedNumber <= 0) {
        return 0
    }

    return Math.floor(parsedNumber)
}

export const createEmptyRequestFormModel = (): DesignRequestFormModel => ({
    clientId: '',
    title: '',
    brandName: '',
    productName: '',
    priority: 'MEDIUM',
    requiredDate: '',
    materialType: 'C',
    materialWeight: '',
    fluteType: 'C',
    fluteDirection: 'Vertical',
    closureType: 'Tapa y Fondo',
    outerLiner: '',
    innerLiner: '',
    colorMode: 'CMYK',
    pantoneReferences: '',
    length: '',
    width: '',
    height: '',
    dimensionUnit: 'cm',
    quantity: '',
    finishingOptions: [],
    deliverables: [],
    designInstructions: '',
    requireDieCut: false,
    requireMockup: false,
    sampleFiles: [],
})

const toRequestFormModel = (request: DesignRequest): DesignRequestFormModel => ({
    clientId: request.clientId,
    title: request.title,
    brandName: request.brandName,
    productName: request.productName,
    priority: request.priority,
    requiredDate: request.requiredDate ?? '',
    materialType: request.materialType,
    materialWeight: request.materialWeight,
    fluteType: request.fluteType,
    fluteDirection: request.fluteDirection,
    closureType: request.closureType,
    outerLiner: request.outerLiner,
    innerLiner: request.innerLiner,
    colorMode: request.colorMode,
    pantoneReferences: request.pantoneReferences,
    length: request.length?.toString() ?? '',
    width: request.width?.toString() ?? '',
    height: request.height?.toString() ?? '',
    dimensionUnit: 'cm',
    quantity: request.quantity.toString(),
    finishingOptions: [...request.finishingOptions],
    deliverables: [...request.deliverables],
    designInstructions: request.designInstructions,
    requireDieCut: request.requireDieCut,
    requireMockup: request.requireMockup,
    sampleFiles: [],
})

const toRequestPayload = (sourceModel: DesignRequestFormModel) => ({
    clientId: sourceModel.clientId,
    title: sourceModel.title.trim(),
    brandName: sourceModel.brandName.trim(),
    productName: sourceModel.productName.trim(),
    priority: sourceModel.priority,
    requiredDate: sourceModel.requiredDate || null,
    version: {
        materialType: sourceModel.materialType,
        materialWeight: sourceModel.materialWeight.trim(),
        fluteType: sourceModel.fluteType,
        fluteDirection: sourceModel.fluteDirection,
        closureType: sourceModel.closureType,
        outerLiner: sourceModel.outerLiner.trim(),
        innerLiner: sourceModel.innerLiner.trim(),
        colorMode: sourceModel.colorMode,
        pantoneReferences: sourceModel.pantoneReferences.trim(),
        length: toSafeNumber(sourceModel.length) || undefined,
        width: toSafeNumber(sourceModel.width) || undefined,
        height: toSafeNumber(sourceModel.height) || undefined,
        dimensionUnit: sourceModel.dimensionUnit,
        quantity: toSafeNumber(sourceModel.quantity) || undefined,
        finishingOptions: [...sourceModel.finishingOptions],
        deliverables: [...sourceModel.deliverables],
        designInstructions: sourceModel.designInstructions.trim(),
        requireDieCut: sourceModel.requireDieCut,
        requireMockup: sourceModel.requireMockup,
    },
    sampleFiles: sourceModel.sampleFiles,
})

let hydratePromise: Promise<void> | null = null

export const useRequestsModule = () => {
    const apiClient = useApiClient()
    const toast = useAppToast()
    const workflowStore = useRequestWorkflowStore()
    const requests = useState<DesignRequest[]>('requests-module-list', () => [])
    const isHydrated = useState<boolean>('requests-module-hydrated', () => false)
    const importInputRef = ref<HTMLInputElement | null>(null)
    const accessToken = useCookie<string | null>('access_token')
    const isVendedor = computed(() => {
        const token = accessToken.value
        return token ? authTokenHasRole(token, 'vendedor') : false
    })

    const isJefe = computed(() => {
        const token = accessToken.value
        return token ? authTokenHasRole(token, 'disenador_jefe') : false
    })

    const isDisenador = computed(() => {
        const token = accessToken.value
        return token ? authTokenHasRole(token, 'disenador') : false
    })

    const currentUserId = computed(() => {
        const token = accessToken.value
        return token ? getAuthTokenUserId(token) : null
    })

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
    const draftRequests = computed(
        () => requests.value.filter((r) => r.status === 'CREATED').length,
    )
    const inDesignRequests = computed(
        () => requests.value.filter((r) => r.status === 'IN_DESIGN').length,
    )
    const highPriorityRequests = computed(
        () => requests.value.filter((r) => r.priority === 'HIGH').length,
    )

    const NEW_REQUEST_STATUSES = new Set<RequestStatus>(['CREATED', 'PENDING_DESIGN_REVIEW'])
    const pendingAssignmentRequests = computed(() =>
        requests.value.filter((r) => NEW_REQUEST_STATUSES.has(r.status)),
    )
    const completedRequests = computed(() =>
        requests.value.filter((r) => r.status === 'QUALITY_APPROVED'),
    )

    const tableRows = computed<DesignRequestTableRow[]>(() => {
        return requests.value.map((request) => ({
            id: request.id,
            requestCode: request.requestCode,
            versionNumber: request.versionNumber,
            clientName: request.clientName,
            productName: request.productName,
            materialType: request.materialType,
            printTechnique: request.printTechnique,
            priority: request.priority,
            status: request.status,
            requiredDateLabel: formatDateLabel(request.requiredDate ?? ''),
            attachmentsCount: request.sampleFiles.length.toString(),
            requestedBy: request.requestedBy,
            assignedDesigners: request.assignedDesigners,
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
            const response = await apiClient.put<DesignRequest>(
                `/requests/${requestId}`,
                toRequestPayload(formModel),
            )

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

    const duplicateRequest = async (requestId: string) => {
        const request = findRequestById(requestId)

        if (!request) {
            toast.error('No se encontró la solicitud seleccionada.')
            return
        }

        const nextCode = toRequestCode(requests.value.length + 1)
        const created = await createRequest(toRequestFormModel(request))

        if (created) {
            toast.success(`Solicitud duplicada como ${nextCode}`)
        }
    }

    const sendToDesign = async (requestId: string) => {
        const request = findRequestById(requestId)

        if (!request) {
            toast.error('No se encontró la solicitud seleccionada.')
            return
        }

        try {
            const response = await apiClient.put<DesignRequest>(`/requests/${requestId}`, {
                status: 'En diseño' as RequestStatus,
            })
            requests.value = requests.value.map((item) =>
                item.id === requestId ? response.data : item,
            )
            workflowStore.upsertFromDesignRequest(response.data)
            toast.success(`Solicitud enviada a diseño: ${request.requestCode}`)
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || 'No se pudo enviar la solicitud a diseño.')
        }
    }

    const approveQualityReview = async (requestId: string, generalObservations?: string) => {
        const request = findRequestById(requestId)
        if (!request) {
            toast.error('No se encontró la solicitud seleccionada.')
            return false
        }
        try {
            await apiClient.post(`/requests/${requestId}/quality-review`, {
                decision: 'APPROVED',
                generalObservations: generalObservations ?? '',
            })
            requests.value = requests.value.map((item) =>
                item.id === requestId
                    ? { ...item, status: 'QUALITY_APPROVED' as RequestStatus }
                    : item,
            )
            const updated = requests.value.find((r) => r.id === requestId)
            if (updated) workflowStore.upsertFromDesignRequest(updated)
            toast.success(`Solicitud aprobada: ${request.requestCode}`)
            return true
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || 'No se pudo aprobar la solicitud.')
            return false
        }
    }

    const rejectQualityReview = async (requestId: string, generalObservations?: string) => {
        const request = findRequestById(requestId)
        if (!request) {
            toast.error('No se encontró la solicitud seleccionada.')
            return false
        }
        try {
            await apiClient.post(`/requests/${requestId}/quality-review`, {
                decision: 'REJECTED',
                generalObservations: generalObservations ?? '',
            })
            requests.value = requests.value.map((item) =>
                item.id === requestId
                    ? { ...item, status: 'ASSIGNED_TO_DESIGNER' as RequestStatus }
                    : item,
            )
            const updated = requests.value.find((r) => r.id === requestId)
            if (updated) workflowStore.upsertFromDesignRequest(updated)
            toast.success(`Solicitud devuelta a diseño: ${request.requestCode}`)
            return true
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || 'No se pudo rechazar la solicitud.')
            return false
        }
    }

    const sendToQualityReview = async (requestId: string) => {
        const request = findRequestById(requestId)

        if (!request) {
            toast.error('No se encontró la solicitud seleccionada.')
            return
        }

        try {
            await apiClient.post(`/requests/${requestId}/submit-to-quality`)
            requests.value = requests.value.map((item) =>
                item.id === requestId
                    ? { ...item, status: 'SENT_TO_QUALITY' as RequestStatus }
                    : item,
            )
            toast.success(`Solicitud enviada a calidad: ${request.requestCode}`)
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || 'No se pudo enviar la solicitud a calidad.')
        }
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

    const toRows = (list: DesignRequest[]): DesignRequestTableRow[] =>
        list.map((request) => ({
            id: request.id,
            requestCode: request.requestCode,
            versionNumber: request.versionNumber,
            clientName: request.clientName,
            productName: request.productName,
            materialType: request.materialType,
            printTechnique: request.printTechnique,
            priority: request.priority,
            status: request.status,
            requiredDateLabel: formatDateLabel(request.requiredDate ?? ''),
            attachmentsCount: request.sampleFiles.length.toString(),
            requestedBy: request.requestedBy,
            assignedDesigners: request.assignedDesigners,
        }))

    const pendingAssignmentRows = computed(() => toRows(pendingAssignmentRequests.value))
    const completedRows = computed(() => toRows(completedRequests.value))

    const myAssignedRows = computed(() =>
        toRows(
            requests.value.filter((r) =>
                r.assignedDesigners.some((a) => a.designerId === currentUserId.value),
            ),
        ),
    )

    const assignDesigner = async (requestId: string, designerId: string, designerName: string) => {
        const request = findRequestById(requestId)
        if (!request) {
            toast.error('No se encontró la solicitud.')
            return false
        }

        try {
            await apiClient.post(`/requests/${requestId}/assignments`, {
                designerIds: [designerId],
            })
            await hydrateRequests(true)
            toast.success(`${designerName} asignado a ${request.requestCode}`)
            return true
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || 'No se pudo asignar el diseñador.')
            return false
        }
    }

    const toggleChecklist = async (requestId: string, item: 'art' | 'mechanical' | 'dummy') => {
        try {
            const response = await apiClient.patch<{
                newValue: boolean
                checklist: {
                    artCompleted: boolean
                    mechanicalCompleted: boolean
                    dummyCompleted: boolean
                }
            }>(`/requests/${requestId}/checklist/${item}`)

            requests.value = requests.value.map((r) => {
                if (r.id !== requestId) return r
                return {
                    ...r,
                    artCompleted: response.data.checklist.artCompleted,
                    mechanicalCompleted: response.data.checklist.mechanicalCompleted,
                    dummyCompleted: response.data.checklist.dummyCompleted,
                }
            })
            return response.data.newValue
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || 'No se pudo actualizar el checklist.')
            return null
        }
    }

    const uploadAttachments = async (
        requestId: string,
        files: { originalName: string; mimeType: string; base64Content: string; notes?: string }[],
    ) => {
        try {
            const response = await apiClient.post<
                {
                    id: string
                    originalName: string
                    mimeType: string
                    sizeBytes: number
                    base64Content: string
                    notes: string
                    createdAt: string
                }[]
            >(`/requests/${requestId}/attachments`, { files })

            requests.value = requests.value.map((r) => {
                if (r.id !== requestId) return r
                return { ...r, attachments: [...(r.attachments ?? []), ...response.data] }
            })
            toast.success(`${files.length} archivo(s) subido(s) correctamente.`)
            return true
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || 'No se pudieron subir los archivos.')
            return false
        }
    }

    const removeDesignerAssignment = async (requestId: string, designerId: string) => {
        const request = findRequestById(requestId)
        if (!request) {
            toast.error('No se encontró la solicitud.')
            return false
        }

        try {
            const response = await apiClient.delete<DesignRequest>(
                `/requests/${requestId}/assignments/${designerId}`,
            )
            requests.value = requests.value.map((item) =>
                item.id === requestId ? response.data : item,
            )
            workflowStore.upsertFromDesignRequest(response.data)
            toast.success(`Asignación removida de ${request.requestCode}`)
            return true
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || 'No se pudo quitar la asignación.')
            return false
        }
    }

    return {
        importInputRef,
        isVendedor,
        isJefe,
        isDisenador,
        currentUserId,
        totalRequests,
        draftRequests,
        inDesignRequests,
        highPriorityRequests,
        tableRows,
        pendingAssignmentRows,
        completedRows,
        myAssignedRows,
        createRequest,
        updateRequest,
        removeRequest,
        duplicateRequest,
        sendToDesign,
        sendToQualityReview,
        approveQualityReview,
        rejectQualityReview,
        assignDesigner,
        toggleChecklist,
        uploadAttachments,
        removeDesignerAssignment,
        findRequestById,
        getFormModelById,
        triggerImport,
        handleImportSelection,
        exportRequests,
        hydrateRequests,
    }
}
