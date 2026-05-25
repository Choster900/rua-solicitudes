export const REQUEST_STATUSES = ['Borrador', 'En revisión', 'En diseño', 'Aprobada'] as const
export type RequestStatus = (typeof REQUEST_STATUSES)[number]

export const REQUEST_PRIORITIES = ['Alta', 'Media', 'Baja'] as const
export type RequestPriority = (typeof REQUEST_PRIORITIES)[number]

export interface RequestAttachment {
    id: string
    name: string
    extension: string
    sizeKb: number
}
