import dayjs from 'dayjs'
import { requireSessionUser } from '../../utils/auth-session.util'
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
    assignedDesigners: (req.currentVersion?.assignments ?? []).map((a: any) => ({
        designerId: a.designerId,
        designerName: a.designer?.fullName ?? '',
        isLead: Boolean(a.isLeadDesigner),
    })),
    artCompleted: Boolean(req.currentVersion?.artCompleted),
    mechanicalCompleted: Boolean(req.currentVersion?.mechanicalCompleted),
    dummyCompleted: Boolean(req.currentVersion?.dummyCompleted),
})

export default defineEventHandler(async (event) => {
    requireSessionUser(event)

    const requests = await prisma.designRequest.findMany({
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
        },
    })

    const grouped = Object.fromEntries(ALL_STATUSES.map((s) => [s, []])) as Record<
        RequestStatus,
        ReturnType<typeof serialize>[]
    >

    for (const req of requests) {
        const status = req.status as RequestStatus
        grouped[status]?.push(serialize(req))
    }

    return grouped
})
