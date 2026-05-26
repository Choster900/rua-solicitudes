export interface DesignRequestTableRow {
    id: string
    requestCode: string
    clientName: string
    productName: string
    materialType: string
    printTechnique: string
    priority: string
    status: string
    currentVersion: number
    assignedDesignerId: string | null
    requiredDateLabel: string
    attachmentsCount: string
    requestedBy: string
}
