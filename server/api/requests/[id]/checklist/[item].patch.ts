import { requireSessionUser } from '../../../../utils/auth-session.util'
import { prisma } from '../../../../database/prisma'

const CHECKLIST_FIELD_MAP = {
    art: 'artCompleted',
    mechanical: 'mechanicalCompleted',
    dummy: 'dummyCompleted',
} as const

const COMPLETED_AT_MAP = {
    art: 'artCompletedAt',
    mechanical: 'mechanicalCompletedAt',
    dummy: 'dummyCompletedAt',
} as const

type ChecklistItem = keyof typeof CHECKLIST_FIELD_MAP

export default defineEventHandler(async (event) => {
    const sessionUser = requireSessionUser(event)

    const requestId = String(getRouterParam(event, 'id') ?? '').trim()
    const item = String(getRouterParam(event, 'item') ?? '').trim() as ChecklistItem

    if (!requestId) {
        throw createError({ statusCode: 400, statusMessage: 'ID de solicitud inválido.' })
    }

    if (!CHECKLIST_FIELD_MAP[item]) {
        throw createError({
            statusCode: 400,
            statusMessage: `Item de checklist inválido. Valores permitidos: ${Object.keys(CHECKLIST_FIELD_MAP).join(', ')}.`,
        })
    }

    const request = await prisma.designRequest.findUnique({
        where: { id: requestId },
        select: {
            currentVersionId: true,
            currentVersion: {
                select: {
                    id: true,
                    artCompleted: true,
                    mechanicalCompleted: true,
                    dummyCompleted: true,
                    assignments: { select: { designerId: true } },
                },
            },
        },
    })

    if (!request?.currentVersion) {
        throw createError({ statusCode: 404, statusMessage: 'Solicitud no encontrada.' })
    }

    const isAssigned = request.currentVersion.assignments.some(
        (a) => a.designerId === sessionUser.sub,
    )
    const isLead =
        sessionUser.roleCodes.includes('disenador_jefe') || sessionUser.roleCodes.includes('admin')

    if (!isAssigned && !isLead) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Solo los diseñadores asignados pueden actualizar el checklist.',
        })
    }

    const field = CHECKLIST_FIELD_MAP[item]
    const atField = COMPLETED_AT_MAP[item]
    const currentValue = request.currentVersion[field]
    const newValue = !currentValue

    const updated = await prisma.designRequestVersion.update({
        where: { id: request.currentVersion.id },
        data: {
            [field]: newValue,
            [atField]: newValue ? new Date() : null,
        },
        select: {
            id: true,
            artCompleted: true,
            artCompletedAt: true,
            mechanicalCompleted: true,
            mechanicalCompletedAt: true,
            dummyCompleted: true,
            dummyCompletedAt: true,
        },
    })

    return {
        item,
        previousValue: currentValue,
        newValue,
        checklist: updated,
    }
})
