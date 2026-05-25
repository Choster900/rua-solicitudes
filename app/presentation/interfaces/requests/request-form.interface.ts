import type { RequestAttachment, RequestPriority, RequestStatus } from '~/presentation/interfaces/requests/request.interface'

export interface DesignRequestFormModel {
  clientName: string
  brandName: string
  productName: string
  requestedBy: string
  vendorName: string
  materialType: string
  materialWeight: string
  printTechnique: string
  colorMode: string
  pantoneReferences: string
  finishingOptions: string[]
  deliverables: string[]
  dimensions: string
  quantity: string
  requiredDate: string
  priority: RequestPriority
  status: RequestStatus
  designInstructions: string
  visualReferences: string
  requireDieCut: boolean
  requireMockup: boolean
  attachments: RequestAttachment[]
}
