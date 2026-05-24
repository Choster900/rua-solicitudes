import { useState } from '#imports'
import { computed, ref } from 'vue'
import { requestsMockData } from '~/mocks/modules/requests'
import { useRequestWorkflowStore } from '~/presentation/request-workflow/stores/useRequestWorkflowStore'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import type { DesignRequestFormModel } from '~/presentation/requests/interfaces/request-form.interface'
import type { DesignRequest, RequestAttachment, RequestStatus } from '~/presentation/requests/interfaces/request.interface'
import type { DesignRequestTableRow } from '~/presentation/requests/interfaces/request-table-row.interface'
import { downloadCsvFile } from '~/utils/csv/download-csv.util'

const formatDateLabel = (dateValue: string) => {
  if (!dateValue) {
    return 'Sin fecha'
  }

  const parsedDate = new Date(dateValue)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Fecha inválida'
  }

  return new Intl.DateTimeFormat('es-SV', { dateStyle: 'medium' }).format(parsedDate)
}

const toRequestCode = (sequence: number) => {
  const year = new Date().getFullYear()
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
  clientName: '',
  brandName: '',
  productName: '',
  requestedBy: '',
  vendorName: '',
  materialType: '',
  materialWeight: '',
  printTechnique: '',
  colorMode: '',
  pantoneReferences: '',
  finishingOptions: [],
  deliverables: [],
  dimensions: '',
  quantity: '',
  requiredDate: '',
  priority: 'Media',
  status: 'Borrador',
  designInstructions: '',
  visualReferences: '',
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
  requireDieCut: request.requireDieCut,
  requireMockup: request.requireMockup,
  attachments: [...request.attachments],
})

const toRequestRecord = (
  sourceModel: DesignRequestFormModel,
  requestCode: string,
  id: string,
  createdAt: string,
): DesignRequest => ({
  id,
  requestCode,
  clientName: sourceModel.clientName.trim(),
  brandName: sourceModel.brandName.trim(),
  productName: sourceModel.productName.trim(),
  requestedBy: sourceModel.requestedBy.trim(),
  vendorName: sourceModel.vendorName.trim(),
  materialType: sourceModel.materialType,
  materialWeight: sourceModel.materialWeight.trim(),
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
  requireDieCut: sourceModel.requireDieCut,
  requireMockup: sourceModel.requireMockup,
  attachments: [...sourceModel.attachments],
  createdAt,
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

export const useRequestsModule = () => {
  const toast = useAppToast()
  const workflowStore = useRequestWorkflowStore()
  const requests = useState<DesignRequest[]>('requests-module-list', () => {
    return requestsMockData.map(request => ({ ...request }))
  })
  const importInputRef = ref<HTMLInputElement | null>(null)

  requests.value.forEach((request) => {
    workflowStore.upsertFromDesignRequest(request)
  })

  const totalRequests = computed(() => requests.value.length)
  const draftRequests = computed(() => requests.value.filter(request => request.status === 'Borrador').length)
  const inDesignRequests = computed(() => requests.value.filter(request => request.status === 'En diseño').length)
  const highPriorityRequests = computed(() => requests.value.filter(request => request.priority === 'Alta').length)

  const tableRows = computed<DesignRequestTableRow[]>(() => {
    return requests.value.map(request => ({
      id: request.id,
      requestCode: request.requestCode,
      clientName: request.clientName,
      productName: request.productName,
      materialType: request.materialType,
      printTechnique: request.printTechnique,
      priority: request.priority,
      status: request.status,
      requiredDateLabel: formatDateLabel(request.requiredDate),
      attachmentsCount: request.attachments.length.toString(),
      requestedBy: request.requestedBy,
    }))
  })

  const findRequestById = (requestId: string) => {
    return requests.value.find(request => request.id === requestId) ?? null
  }

  const getFormModelById = (requestId: string): DesignRequestFormModel | null => {
    const request = findRequestById(requestId)

    if (!request) {
      return null
    }

    return toRequestFormModel(request)
  }

  const createRequest = (formModel: DesignRequestFormModel) => {
    const nextSequence = requests.value.length + 1
    const nextCode = toRequestCode(nextSequence)
    const nowIso = new Date().toISOString()
    const nextId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? `req-${crypto.randomUUID()}`
      : `req-${Date.now()}`
    const nextRequest = toRequestRecord(formModel, nextCode, nextId, nowIso)

    requests.value = [nextRequest, ...requests.value]
    workflowStore.upsertFromDesignRequest(nextRequest)
    toast.success(`Solicitud creada: ${nextCode}`)
  }

  const updateRequest = (requestId: string, formModel: DesignRequestFormModel) => {
    const existingRequest = findRequestById(requestId)

    if (!existingRequest) {
      toast.error('No se encontró la solicitud seleccionada.')
      return false
    }

    const updatedRequest = toRequestRecord(
      formModel,
      existingRequest.requestCode,
      existingRequest.id,
      existingRequest.createdAt,
    )

    requests.value = requests.value.map((request) => {
      if (request.id !== requestId) {
        return request
      }

      return updatedRequest
    })
    workflowStore.upsertFromDesignRequest(updatedRequest)

    toast.success(`Solicitud actualizada: ${existingRequest.requestCode}`)
    return true
  }

  const removeRequest = (requestId: string) => {
    const request = findRequestById(requestId)

    if (!request) {
      toast.error('No se encontró la solicitud seleccionada.')
      return
    }

    const shouldRemove = window.confirm(`¿Deseas eliminar la solicitud ${request.requestCode}?`)

    if (!shouldRemove) {
      return
    }

    requests.value = requests.value.filter(item => item.id !== requestId)
    workflowStore.removeByRequestId(requestId)
    toast.success(`Solicitud eliminada: ${request.requestCode}`)
  }

  const duplicateRequest = (requestId: string) => {
    const request = findRequestById(requestId)

    if (!request) {
      toast.error('No se encontró la solicitud seleccionada.')
      return
    }

    const nextCode = toRequestCode(requests.value.length + 1)
    const nowIso = new Date().toISOString()
    const nextId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? `req-${crypto.randomUUID()}`
      : `req-${Date.now()}`
    const duplicatedRequest: DesignRequest = {
      ...request,
      id: nextId,
      requestCode: nextCode,
      status: 'Borrador',
      createdAt: nowIso,
    }

    requests.value = [duplicatedRequest, ...requests.value]
    workflowStore.upsertFromDesignRequest(duplicatedRequest)
    toast.success(`Solicitud duplicada como ${nextCode}`)
  }

  const sendToDesign = (requestId: string) => {
    const request = findRequestById(requestId)

    if (!request) {
      toast.error('No se encontró la solicitud seleccionada.')
      return
    }

    requests.value = requests.value.map((item) => {
      if (item.id !== requestId) {
        return item
      }

      return {
        ...item,
        status: 'En diseño' as RequestStatus,
      }
    })

    toast.success(`Solicitud enviada a diseño: ${request.requestCode}`)
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

    toast.info(`Archivo seleccionado: ${selectedFile.name}. Integración de importación pendiente.`)
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
    draftRequests,
    inDesignRequests,
    highPriorityRequests,
    tableRows,
    createRequest,
    updateRequest,
    removeRequest,
    duplicateRequest,
    sendToDesign,
    findRequestById,
    getFormModelById,
    triggerImport,
    handleImportSelection,
    exportRequests,
  }
}
