export interface DesignRequestTableRow {
    id: string
    requestCode: string
    versionNumber: number
    clientName: string
    productName: string
    materialType: string
    printTechnique: string
    priority: string
    status: string
    requiredDateLabel: string
    attachmentsCount: string
    requestedBy: string
    assignedDesigners: { designerId: string; designerName: string }[]
}
