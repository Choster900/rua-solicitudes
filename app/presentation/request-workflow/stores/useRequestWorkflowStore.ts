import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { DesignRequest } from '~/presentation/interfaces/requests/request.interface'
import type {
  WorkflowActionResult,
  WorkflowAuditEntry,
  WorkflowChecklistState,
  WorkflowDecision,
  WorkflowPriority,
  WorkflowRequest,
  WorkflowStage,
} from '~/presentation/interfaces/request-workflow/workflow-request.interface'

interface QueueFilters {
  query: string
  priority: 'ALL' | WorkflowPriority
}

interface RequestWorkflowState {
  requests: WorkflowRequest[]
  hydrated: boolean
  designFilters: QueueFilters
  qualityFilters: QueueFilters
}

const designQueueStages: WorkflowStage[] = ['NEW', 'DESIGN_IN_PROGRESS', 'REJECTED_BY_QUALITY']
const qualityQueueStages: WorkflowStage[] = ['READY_FOR_QUALITY', 'QUALITY_IN_REVIEW']

const createDefaultChecklist = (): WorkflowChecklistState => ({
  briefValidated: false,
  technicalSpecsValidated: false,
  assetsValidated: false,
  legalValidated: false,
})

const isChecklistComplete = (checklist: WorkflowChecklistState) => {
  return Object.values(checklist).every(Boolean)
}

const generateId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

const toPriority = (sourcePriority: DesignRequest['priority']): WorkflowPriority => {
  if (sourcePriority === 'Alta') {
    return 'HIGH'
  }

  if (sourcePriority === 'Media') {
    return 'MEDIUM'
  }

  return 'LOW'
}

const toSlaHours = (requiredDate: string) => {
  if (!requiredDate) {
    return 0
  }

  const due = dayjs(requiredDate)

  if (!due.isValid()) {
    return 0
  }

  const diffInHours = due.diff(dayjs(), 'hour')

  return Math.max(0, diffInHours)
}

const includesQuery = (request: WorkflowRequest, query: string) => {
  if (!query.trim()) {
    return true
  }

  const normalizedQuery = query.trim().toLowerCase()
  const searchableText = [
    request.requestCode,
    request.clientName,
    request.productName,
    request.requestType,
    request.requestedBy,
    request.vendorName,
  ]
    .join(' ')
    .toLowerCase()

  return searchableText.includes(normalizedQuery)
}

const withFilters = (requests: WorkflowRequest[], filters: QueueFilters) => {
  return requests.filter((request) => {
    if (filters.priority !== 'ALL' && request.priority !== filters.priority) {
      return false
    }

    return includesQuery(request, filters.query)
  })
}

const stageLabelMap: Record<WorkflowStage, string> = {
  NEW: 'Nueva',
  DESIGN_IN_PROGRESS: 'Diseño en progreso',
  READY_FOR_QUALITY: 'Lista para calidad',
  QUALITY_IN_REVIEW: 'Calidad en revisión',
  REJECTED_BY_QUALITY: 'Rechazada por calidad',
  APPROVED: 'Aprobada',
}

export const useRequestWorkflowStore = defineStore('request-workflow', {
  state: (): RequestWorkflowState => ({
    requests: [],
    hydrated: false,
    designFilters: {
      query: '',
      priority: 'ALL',
    },
    qualityFilters: {
      query: '',
      priority: 'ALL',
    },
  }),

  getters: {
    allRequests: state => state.requests,
    requestById: state => (requestId: string) => state.requests.find(request => request.id === requestId) ?? null,
    designQueue: state => withFilters(
      state.requests.filter(request => designQueueStages.includes(request.stage)),
      state.designFilters,
    ),
    qualityQueue: state => withFilters(
      state.requests.filter(request => qualityQueueStages.includes(request.stage)),
      state.qualityFilters,
    ),
    approvedRequests: state => state.requests.filter(request => request.stage === 'APPROVED'),
    metrics: (state) => {
      const total = state.requests.length
      const designPending = state.requests.filter(request => designQueueStages.includes(request.stage)).length
      const qualityPending = state.requests.filter(request => qualityQueueStages.includes(request.stage)).length
      const approved = state.requests.filter(request => request.stage === 'APPROVED').length
      const overdue = state.requests.filter((request) => {
        if (request.stage === 'APPROVED') {
          return false
        }

        const dueDate = dayjs(request.requiredDate)

        if (!dueDate.isValid()) {
          return false
        }

        return dueDate.isBefore(dayjs())
      }).length

      return {
        total,
        designPending,
        qualityPending,
        approved,
        overdue,
      }
    },
  },

  actions: {
    async hydrate() {
      if (this.hydrated) {
        return
      }

      const designRequests = await $fetch<DesignRequest[]>('/api/requests')

      if (!this.requests.length) {
        designRequests.forEach(request => this.upsertFromDesignRequest(request))
      }

      this.hydrated = true
    },

    setDesignFilters(nextFilters: Partial<QueueFilters>) {
      this.designFilters = {
        ...this.designFilters,
        ...nextFilters,
      }
    },

    setQualityFilters(nextFilters: Partial<QueueFilters>) {
      this.qualityFilters = {
        ...this.qualityFilters,
        ...nextFilters,
      }
    },

    resetFilters() {
      this.designFilters = { query: '', priority: 'ALL' }
      this.qualityFilters = { query: '', priority: 'ALL' }
    },

    upsertFromDesignRequest(request: DesignRequest) {
      const existingRequest = this.requests.find(item => item.id === request.id)
      const nowIso = dayjs().toISOString()
      const sharedPayload = {
        requestCode: request.requestCode,
        clientName: request.clientName,
        productName: request.productName,
        requestType: `${request.materialType} - ${request.printTechnique}`,
        requestedBy: request.requestedBy,
        vendorName: request.vendorName,
        priority: toPriority(request.priority),
        requiredDate: request.requiredDate,
        slaHours: toSlaHours(request.requiredDate),
        evidenceFiles: request.attachments.map(attachment => ({
          id: attachment.id,
          name: attachment.name,
          extension: attachment.extension,
          sizeKb: attachment.sizeKb,
        })),
      }

      if (existingRequest) {
        const hasChanges = (
          existingRequest.requestCode !== sharedPayload.requestCode
          || existingRequest.clientName !== sharedPayload.clientName
          || existingRequest.productName !== sharedPayload.productName
          || existingRequest.requestType !== sharedPayload.requestType
          || existingRequest.requestedBy !== sharedPayload.requestedBy
          || existingRequest.vendorName !== sharedPayload.vendorName
          || existingRequest.priority !== sharedPayload.priority
          || existingRequest.requiredDate !== sharedPayload.requiredDate
          || existingRequest.evidenceFiles.length !== sharedPayload.evidenceFiles.length
        )

        if (!hasChanges) {
          return
        }

        this.requests = this.requests.map((workflowRequest) => {
          if (workflowRequest.id !== request.id) {
            return workflowRequest
          }

          return {
            ...workflowRequest,
            ...sharedPayload,
            updatedAt: nowIso,
          }
        })

        return
      }

      this.requests = [
        {
          id: request.id,
          ...sharedPayload,
          stage: 'NEW',
          createdAt: request.createdAt,
          updatedAt: nowIso,
          checklist: createDefaultChecklist(),
          observations: [],
          auditTrail: [
            {
              id: generateId('audit'),
              requestId: request.id,
              actorName: 'Sistema',
              actorRole: 'Sistema',
              action: 'Solicitud sincronizada',
              fromStage: null,
              toStage: 'NEW',
              comment: 'Solicitud creada desde el modulo de solicitudes.',
              createdAt: nowIso,
            },
          ],
        },
        ...this.requests,
      ]
    },

    removeByRequestId(requestId: string) {
      this.requests = this.requests.filter(request => request.id !== requestId)
    },

    startDesignReview(requestId: string, actorName = 'Equipo Diseño'): WorkflowActionResult {
      return this.transitionStage({
        requestId,
        actorName,
        actorRole: 'Disenador',
        action: 'Diseño tomado',
        allowedFromStages: ['NEW'],
        nextStage: 'DESIGN_IN_PROGRESS',
      })
    },

    sendToQuality(
      requestId: string,
      checklist: WorkflowChecklistState,
      actorName = 'Equipo Diseño',
      comment = '',
    ): WorkflowActionResult {
      const target = this.requestById(requestId)

      if (!target) {
        return {
          success: false,
          message: 'No se encontro la solicitud seleccionada.',
        }
      }

      if (target.stage !== 'DESIGN_IN_PROGRESS') {
        return {
          success: false,
          message: `No se puede enviar a calidad desde ${stageLabelMap[target.stage]}.`,
        }
      }

      if (!isChecklistComplete(checklist)) {
        return {
          success: false,
          message: 'Completa todo el checklist antes de enviar a Calidad.',
        }
      }

      target.checklist = {
        ...checklist,
      }

      return this.transitionStage({
        requestId,
        actorName,
        actorRole: 'Disenador',
        action: 'Enviado a calidad',
        allowedFromStages: ['DESIGN_IN_PROGRESS'],
        nextStage: 'READY_FOR_QUALITY',
        decision: 'SUBMIT_TO_QUALITY',
        comment,
      })
    },

    startQualityReview(requestId: string, actorName = 'Equipo Calidad'): WorkflowActionResult {
      return this.transitionStage({
        requestId,
        actorName,
        actorRole: 'Calidad',
        action: 'Calidad en revision',
        allowedFromStages: ['READY_FOR_QUALITY'],
        nextStage: 'QUALITY_IN_REVIEW',
      })
    },

    approveInQuality(requestId: string, actorName = 'Equipo Calidad', comment = ''): WorkflowActionResult {
      return this.transitionStage({
        requestId,
        actorName,
        actorRole: 'Calidad',
        action: 'Aprobado en calidad',
        allowedFromStages: ['QUALITY_IN_REVIEW'],
        nextStage: 'APPROVED',
        decision: 'APPROVE',
        comment,
      })
    },

    rejectInQuality(requestId: string, observation: string, actorName = 'Equipo Calidad'): WorkflowActionResult {
      if (!observation.trim()) {
        return {
          success: false,
          message: 'La observacion es obligatoria para rechazar en Calidad.',
        }
      }

      const appendResult = this.appendObservation(requestId, observation, actorName, 'Calidad')

      if (!appendResult.success) {
        return appendResult
      }

      return this.transitionStage({
        requestId,
        actorName,
        actorRole: 'Calidad',
        action: 'Rechazado en calidad',
        allowedFromStages: ['QUALITY_IN_REVIEW'],
        nextStage: 'REJECTED_BY_QUALITY',
        decision: 'REJECT',
        comment: observation,
      })
    },

    returnToDesign(requestId: string, actorName = 'Equipo Diseño', comment = ''): WorkflowActionResult {
      return this.transitionStage({
        requestId,
        actorName,
        actorRole: 'Disenador',
        action: 'Solicitud retomada en diseño',
        allowedFromStages: ['REJECTED_BY_QUALITY'],
        nextStage: 'DESIGN_IN_PROGRESS',
        decision: 'RETURN_TO_DESIGN',
        comment,
      })
    },

    appendObservation(
      requestId: string,
      observation: string,
      actorName = 'Equipo Calidad',
      actorRole: 'Vendedor' | 'Disenador' | 'Calidad' | 'Sistema' = 'Calidad',
    ): WorkflowActionResult {
      const target = this.requestById(requestId)

      if (!target) {
        return {
          success: false,
          message: 'No se encontro la solicitud seleccionada.',
        }
      }

      if (!observation.trim()) {
        return {
          success: false,
          message: 'La observacion no puede estar vacia.',
        }
      }

      const cleanObservation = observation.trim()
      target.observations = [cleanObservation, ...target.observations]

      const nowIso = dayjs().toISOString()
      const auditEntry: WorkflowAuditEntry = {
        id: generateId('audit'),
        requestId,
        actorName,
        actorRole,
        action: 'Observacion agregada',
        fromStage: target.stage,
        toStage: target.stage,
        comment: cleanObservation,
        createdAt: nowIso,
      }

      target.auditTrail = [auditEntry, ...target.auditTrail]
      target.updatedAt = nowIso

      return {
        success: true,
        message: 'Observacion registrada.',
      }
    },

    transitionStage(payload: {
      requestId: string
      actorName: string
      actorRole: 'Vendedor' | 'Disenador' | 'Calidad' | 'Sistema'
      action: string
      allowedFromStages: WorkflowStage[]
      nextStage: WorkflowStage
      decision?: WorkflowDecision
      comment?: string
    }): WorkflowActionResult {
      const target = this.requestById(payload.requestId)

      if (!target) {
        return {
          success: false,
          message: 'No se encontro la solicitud seleccionada.',
        }
      }

      if (!payload.allowedFromStages.includes(target.stage)) {
        return {
          success: false,
          message: `Transicion invalida: ${stageLabelMap[target.stage]} -> ${stageLabelMap[payload.nextStage]}.`,
        }
      }

      const nowIso = dayjs().toISOString()
      const previousStage = target.stage
      const updatedRequest: WorkflowRequest = {
        ...target,
        stage: payload.nextStage,
        updatedAt: nowIso,
        slaHours: toSlaHours(target.requiredDate),
        auditTrail: [
          {
            id: generateId('audit'),
            requestId: payload.requestId,
            actorName: payload.actorName,
            actorRole: payload.actorRole,
            action: payload.action,
            decision: payload.decision,
            fromStage: previousStage,
            toStage: payload.nextStage,
            comment: payload.comment?.trim() || `${stageLabelMap[previousStage]} -> ${stageLabelMap[payload.nextStage]}`,
            createdAt: nowIso,
          },
          ...target.auditTrail,
        ],
      }

      this.requests = this.requests.map(request => (request.id === payload.requestId ? updatedRequest : request))

      return {
        success: true,
        message: `Transicion completada: ${stageLabelMap[payload.nextStage]}.`,
      }
    },
  },
})
