import { requireSessionUser } from '../../utils/auth-session.util'
import { prisma } from '../../database/prisma'

export default defineEventHandler(async (event) => {
    const sessionUser = requireSessionUser(event)

    const assignments = await prisma.requestDesignerAssignment.findMany({
        where: {
            designerId: sessionUser.sub,
            status: 'ACTIVE',
        },
        include: {
            version: {
                include: {
                    request: {
                        include: {
                            client: { select: { id: true, name: true, code: true } },
                            seller: { select: { id: true, fullName: true, employeeCode: true } },
                            currentVersion: {
                                include: {
                                    assignments: {
                                        select: {
                                            designerId: true,
                                            isLeadDesigner: true,
                                            status: true,
                                            designer: { select: { id: true, fullName: true } },
                                        },
                                    },
                                    files: {
                                        where: { isActive: true, origin: 'SALES' },
                                        select: {
                                            id: true,
                                            originalName: true,
                                            mimeType: true,
                                            sizeBytes: true,
                                            base64Content: true,
                                            notes: true,
                                            createdAt: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            assignedAt: 'desc',
        },
    })

    return assignments.map((a) => ({
        assignmentId: a.id,
        isLeadDesigner: a.isLeadDesigner,
        assignedAt: a.assignedAt.toISOString(),
        request: a.version.request,
    }))
})
