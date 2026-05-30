import dayjs from 'dayjs'
import { requireSessionUser, getSessionUser } from '../../utils/auth-session.util'
import { prisma } from '../../database/prisma'

type RequestStatus =
    | 'CREATED'
    | 'PENDING_DESIGN_REVIEW'
    | 'ASSIGNED_TO_DESIGNER'
    | 'IN_DESIGN'
    | 'SENT_TO_QUALITY'
    | 'QUALITY_REJECTED'
    | 'QUALITY_APPROVED'
    | 'DELIVERED_TO_SALES'
    | 'CANCELLED'

const ALL_STATUSES: RequestStatus[] = [
    'CREATED',
    'PENDING_DESIGN_REVIEW',
    'ASSIGNED_TO_DESIGNER',
    'IN_DESIGN',
    'SENT_TO_QUALITY',
    'QUALITY_REJECTED',
    'QUALITY_APPROVED',
    'DELIVERED_TO_SALES',
    'CANCELLED',
]

const serializeFile = (f: any) => ({
    id: f.id,
    originalName: f.originalName,
    mimeType: f.mimeType,
    sizeBytes: Number(f.sizeBytes),
    notes: f.notes ?? '',
    createdAt: dayjs(f.createdAt).toISOString(),
})

const serialize = (req: any) => ({
    id: req.id,
    code: req.code,
    title: req.title ?? '',
    clientId: req.clientId,
    clientName: req.client?.name ?? '',
    clientCode: req.client?.code ?? '',
    sellerId: req.sellerId,
    sellerName: req.seller?.fullName ?? '',
    brandName: req.brandName ?? '',
    productName: req.productName ?? '',
    priority: req.priority as string,
    status: req.status as RequestStatus,
    requiredDate: req.requiredDate ? dayjs(req.requiredDate).toISOString() : null,
    createdAt: dayjs(req.createdAt).toISOString(),
    versionNumber: req.currentVersion?.versionNumber ?? 1,
    assignedDesigners: (req.currentVersion?.assignments ?? []).map((a: any) => ({
        designerId: a.designerId,
        designerName: a.designer?.fullName ?? '',
        isLead: Boolean(a.isLeadDesigner),
    })),
    artCompleted: Boolean(req.currentVersion?.artCompleted),
    mechanicalCompleted: Boolean(req.currentVersion?.mechanicalCompleted),
    dummyCompleted: Boolean(req.currentVersion?.dummyCompleted),
    sampleFiles: (req.files ?? []).filter((f: any) => f.origin === 'SALES').map(serializeFile),
    attachments: (req.files ?? []).filter((f: any) => f.origin === 'DESIGN').map(serializeFile),
})

const VENDOR_VISIBLE_STATUSES = new Set<RequestStatus>(['CREATED', 'QUALITY_APPROVED'])

export default defineEventHandler(async (event) => {
    requireSessionUser(event)
    const sessionUser = getSessionUser(event)

    const isVendedor = sessionUser?.roleCodes.includes('vendedor') ?? false

    const where = isVendedor
        ? {
              sellerId: sessionUser!.sub,
              status: { in: ['CREATED', 'QUALITY_APPROVED'] as RequestStatus[] },
          }
        : {}

    const requests = await prisma.designRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            client: { select: { id: true, name: true, code: true } },
            seller: { select: { id: true, fullName: true } },
            currentVersion: {
                include: {
                    assignments: {
                        select: {
                            designerId: true,
                            isLeadDesigner: true,
                            designer: { select: { id: true, fullName: true } },
                        },
                    },
                },
            },
            files: {
                where: { isActive: true },
                orderBy: { createdAt: 'asc' as const },
                select: {
                    id: true,
                    originalName: true,
                    mimeType: true,
                    sizeBytes: true,
                    origin: true,
                    notes: true,
                    createdAt: true,
                },
            },
        },
    })

    const visibleStatuses = isVendedor ? Array.from(VENDOR_VISIBLE_STATUSES) : ALL_STATUSES

    const grouped = Object.fromEntries(visibleStatuses.map((s) => [s, []])) as Record<
        RequestStatus,
        ReturnType<typeof serialize>[]
    >

    for (const req of requests) {
        const status = req.status as RequestStatus
        if (grouped[status]) {
            grouped[status].push(serialize(req))
        }
    }

    return grouped
})
