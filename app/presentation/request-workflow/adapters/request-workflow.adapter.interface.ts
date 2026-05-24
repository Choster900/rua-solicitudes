import type { WorkflowRequest } from '~/presentation/request-workflow/interfaces/workflow-request.interface'

export interface RequestWorkflowAdapter {
  loadRequests: () => Promise<WorkflowRequest[]>
}
