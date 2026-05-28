export interface WorkflowQueueRow {
    id: string
    requestCode: string
    versionNumber: number
    clientName: string
    productName: string
    requestType: string
    requestedBy: string
    priorityLabel: string
    stageLabel: string
    requiredDateLabel: string
    slaLabel: string
    observationsCount: string
}
