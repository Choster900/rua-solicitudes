import { requestWorkflowMockSeed } from '~/mocks/modules/request-workflow'
import type { RequestWorkflowAdapter } from '~/presentation/request-workflow/adapters/request-workflow.adapter.interface'
import type { WorkflowRequest } from '~/presentation/request-workflow/interfaces/workflow-request.interface'

const cloneSeed = (source: WorkflowRequest[]): WorkflowRequest[] => {
  return source.map(request => ({
    ...request,
    checklist: { ...request.checklist },
    evidenceFiles: request.evidenceFiles.map(file => ({ ...file })),
    observations: [...request.observations],
    auditTrail: request.auditTrail.map(entry => ({ ...entry })),
  }))
}

export const requestWorkflowMockAdapter: RequestWorkflowAdapter = {
  async loadRequests() {
    return cloneSeed(requestWorkflowMockSeed)
  },
}
