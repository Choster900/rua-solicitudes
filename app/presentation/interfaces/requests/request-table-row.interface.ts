export interface DesignRequestTableRow {
    id: string
    requestCode: string
    clientName: string
    productName: string
    materialType: string
    printTechnique: string
    priority: string
    status: string
    requiredDateLabel: string
    attachmentsCount: string
    requestedBy: string
    assignedDesignerId: string | null
    assignedDesignerName: string
}
