import type { WorkflowRequest } from '~/presentation/interfaces/request-workflow/workflow-request.interface'

export interface RequestWorkflowAdapter {
  loadRequests: () => Promise<WorkflowRequest[]>
}
