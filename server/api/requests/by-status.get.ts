import { requireSessionUser } from '../../utils/auth-session.util'
import { prisma } from '../../database/prisma'

const ALLOWED_STATUSES = [
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

const includeVersion = {
    include: {
        assignments: {
            select: {
                designerId: true,
                isLeadDesigner: true,
                status: true,
                designer: { select: { id: true, fullName: true } },
            },
        },
    },
} as const

export default defineEventHandler(async (event) => {
    requireSessionUser(event)

    const query = getQuery(event)

    // ?status=CREATED,PENDING_DESIGN_REVIEW  o  ?status=QUALITY_APPROVED
    const rawStatus = typeof query.status === 'string' ? query.status : ''
    const requestedStatuses = rawStatus
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter((s): s is (typeof ALLOWED_STATUSES)[number] =>
            (ALLOWED_STATUSES as readonly string[]).includes(s),
        )

    const whereStatus = requestedStatuses.length > 0 ? { status: { in: requestedStatuses } } : {}

    const requests = await prisma.designRequest.findMany({
        where: whereStatus,
        orderBy: { createdAt: 'desc' },
        include: {
            client: { select: { id: true, name: true, code: true } },
            seller: { select: { id: true, fullName: true, employeeCode: true } },
            currentVersion: includeVersion,
        },
    })

    // Si no viene ?status, devuelve las dos colas principales en un objeto agrupado
    if (!rawStatus) {
        return {
            pendingAssignment: requests.filter((r) =>
                ['CREATED', 'PENDING_DESIGN_REVIEW', 'ASSIGNED_TO_DESIGNER'].includes(r.status),
            ),
            qualityApproved: requests.filter((r) => r.status === 'QUALITY_APPROVED'),
        }
    }

    return requests
})
