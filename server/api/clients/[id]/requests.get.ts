import dayjs from 'dayjs'
import { requireSessionUser } from '../../../utils/auth-session.util'
import { prisma } from '../../../database/prisma'

export default defineEventHandler(async (event) => {
    requireSessionUser(event)

    const clientId = event.context.params?.id ?? ''

    const requests = await prisma.designRequest.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        include: {
            seller: { select: { fullName: true } },
            currentVersion: {
                select: {
                    versionNumber: true,
                    artCompleted: true,
                    mechanicalCompleted: true,
                    dummyCompleted: true,
                },
            },
        },
    })

    return requests.map((req) => ({
        id: req.id,
        code: req.code,
        title: req.title ?? '',
        productName: req.productName ?? '',
        priority: req.priority,
        status: req.status,
        versionNumber: req.currentVersion?.versionNumber ?? 1,
        sellerName: req.seller?.fullName ?? '',
        requiredDate: req.requiredDate ? dayjs(req.requiredDate).toISOString() : null,
        createdAt: dayjs(req.createdAt).toISOString(),
    }))
})
