export const REQUEST_STATUSES = [
    'CREATED',
    'PENDING_DESIGN_REVIEW',
    'ASSIGNED_TO_DESIGNER',
    'IN_DESIGN',
    'SENT_TO_QUALITY',
    'QUALITY_REJECTED',
    'QUALITY_APPROVED',
    'DELIVERED_TO_SALES',
    'CANCELLED',
] as const
export type RequestStatus = (typeof REQUEST_STATUSES)[number]

export const REQUEST_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const
export type RequestPriority = (typeof REQUEST_PRIORITIES)[number]
