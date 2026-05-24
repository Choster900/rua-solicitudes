import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import type { AppStatusBadgeTone } from '~/presentation/request-workflow/interfaces/workflow-ui.type'
import type {
  WorkflowChecklistState,
  WorkflowPriority,
  WorkflowRequest,
  WorkflowStage,
} from '~/presentation/request-workflow/interfaces/workflow-request.interface'
import type { WorkflowQueueRow } from '~/presentation/request-workflow/interfaces/workflow-queue-row.interface'
import { useRequestWorkflowStore } from '~/presentation/request-workflow/stores/useRequestWorkflowStore'

const priorityLabelMap: Record<WorkflowPriority, string> = {
  HIGH: 'Alta',
  MEDIUM: 'Media',
  LOW: 'Baja',
}

const stageLabelMap: Record<WorkflowStage, string> = {
  NEW: 'Nueva',
  DESIGN_IN_PROGRESS: 'Diseño en progreso',
  READY_FOR_QUALITY: 'Lista para calidad',
  QUALITY_IN_REVIEW: 'Calidad en revisión',
  REJECTED_BY_QUALITY: 'Rechazada por calidad',
  APPROVED: 'Aprobada',
}

const stageToneMap: Record<WorkflowStage, AppStatusBadgeTone> = {
  NEW: 'neutral',
  DESIGN_IN_PROGRESS: 'warning',
  READY_FOR_QUALITY: 'neutral',
  QUALITY_IN_REVIEW: 'warning',
  REJECTED_BY_QUALITY: 'danger',
  APPROVED: 'success',
}

const priorityToneMap: Record<WorkflowPriority, AppStatusBadgeTone> = {
  HIGH: 'danger',
  MEDIUM: 'warning',
  LOW: 'neutral',
}

const checklistFieldLabels: Record<keyof WorkflowChecklistState, string> = {
  briefValidated: 'Brief validado',
  technicalSpecsValidated: 'Especificaciones técnicas',
  assetsValidated: 'Assets y archivos fuente',
  legalValidated: 'Revisión legal y etiquetas',
}

const formatDate = (sourceDate: string) => {
  if (!sourceDate) {
    return 'Sin fecha'
  }

  const parsedDate = new Date(sourceDate)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Fecha inválida'
  }

  return new Intl.DateTimeFormat('es-SV', {
    dateStyle: 'medium',
  }).format(parsedDate)
}

const toSlaLabel = (slaHours: number) => {
  if (slaHours <= 0) {
    return 'Vencido'
  }

  return `${slaHours}h`
}

const toQueueRows = (requests: WorkflowRequest[]): WorkflowQueueRow[] => {
  return requests.map(request => ({
    id: request.id,
    requestCode: request.requestCode,
    clientName: request.clientName,
    productName: request.productName,
    requestType: request.requestType,
    requestedBy: request.requestedBy,
    priorityLabel: priorityLabelMap[request.priority],
    stageLabel: stageLabelMap[request.stage],
    requiredDateLabel: formatDate(request.requiredDate),
    slaLabel: toSlaLabel(request.slaHours),
    observationsCount: request.observations.length.toString(),
  }))
}

export const useRequestWorkflowModule = () => {
  const workflowStore = useRequestWorkflowStore()
  const toast = useAppToast()

  const {
    designQueue,
    qualityQueue,
    approvedRequests,
    metrics,
    designFilters,
    qualityFilters,
  } = storeToRefs(workflowStore)

  const designRows = computed(() => toQueueRows(designQueue.value))
  const qualityRows = computed(() => toQueueRows(qualityQueue.value))

  const priorityOptions = [
    { label: 'Todas', value: 'ALL' },
    { label: 'Alta', value: 'HIGH' },
    { label: 'Media', value: 'MEDIUM' },
    { label: 'Baja', value: 'LOW' },
  ]

  const notifyActionResult = (result: { success: boolean, message: string }) => {
    if (result.success) {
      toast.success(result.message)
      return
    }

    toast.warning(result.message)
  }

  return {
    workflowStore,
    designQueue,
    qualityQueue,
    approvedRequests,
    metrics,
    designRows,
    qualityRows,
    designFilters,
    qualityFilters,
    priorityOptions,
    stageLabelMap,
    stageToneMap,
    priorityLabelMap,
    priorityToneMap,
    checklistFieldLabels,
    formatDate,
    notifyActionResult,
  }
}
