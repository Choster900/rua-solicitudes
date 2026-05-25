export const workflowStages = [
  'NEW',
  'DESIGN_IN_PROGRESS',
  'READY_FOR_QUALITY',
  'QUALITY_IN_REVIEW',
  'REJECTED_BY_QUALITY',
  'APPROVED',
] as const

export const workflowDecisions = [
  'SUBMIT_TO_QUALITY',
  'APPROVE',
  'REJECT',
  'RETURN_TO_DESIGN',
] as const

export const workflowPriorities = ['HIGH', 'MEDIUM', 'LOW'] as const

export type WorkflowStage = (typeof workflowStages)[number]
export type WorkflowDecision = (typeof workflowDecisions)[number]
export type WorkflowPriority = (typeof workflowPriorities)[number]

export interface WorkflowChecklistState {
  briefValidated: boolean
  technicalSpecsValidated: boolean
  assetsValidated: boolean
  legalValidated: boolean
}

export interface WorkflowEvidenceFile {
  id: string
  name: string
  extension: string
  sizeKb: number
}

export interface WorkflowAuditEntry {
  id: string
  requestId: string
  actorName: string
  actorRole: 'Vendedor' | 'Disenador' | 'Calidad' | 'Sistema'
  action: string
  decision?: WorkflowDecision
  fromStage: WorkflowStage | null
  toStage: WorkflowStage | null
  comment: string
  createdAt: string
}

export interface WorkflowRequest {
  id: string
  requestCode: string
  clientName: string
  productName: string
  requestType: string
  requestedBy: string
  vendorName: string
  priority: WorkflowPriority
  stage: WorkflowStage
  requiredDate: string
  createdAt: string
  updatedAt: string
  slaHours: number
  checklist: WorkflowChecklistState
  evidenceFiles: WorkflowEvidenceFile[]
  observations: string[]
  auditTrail: WorkflowAuditEntry[]
}

export interface WorkflowActionResult {
  success: boolean
  message: string
}
