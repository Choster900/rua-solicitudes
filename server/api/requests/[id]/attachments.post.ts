import { findDesignRequestById } from '../../../repositories/design-requests.repository'
import { requireSessionUser } from '../../../utils/auth-session.util'
import { prisma } from '../../../database/prisma'

export default defineEventHandler(async (event) => {
    const sessionUser = requireSessionUser(event)

    const allowedRoles = ['disenador', 'disenador_jefe', 'admin']
    if (!allowedRoles.some((r) => sessionUser.roleCodes.includes(r))) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Solo diseñadores pueden subir archivos.',
        })
    }

    const requestId = String(getRouterParam(event, 'id') ?? '').trim()
    if (!requestId) {
        throw createError({ statusCode: 400, statusMessage: 'ID de solicitud inválido.' })
    }

    const sourceRequest = await findDesignRequestById(requestId)
    if (!sourceRequest) {
        throw createError({ statusCode: 404, statusMessage: 'Solicitud no encontrada.' })
    }

    const body = (await readBody(event)) as {
        files: { originalName: string; mimeType: string; base64Content: string; notes?: string }[]
    } | null

    if (!body?.files?.length) {
        throw createError({ statusCode: 400, statusMessage: 'No se enviaron archivos.' })
    }

    const saved = await Promise.all(
        body.files.map((file) =>
            prisma.requestFile.create({
                data: {
                    requestId,
                    versionId: sourceRequest.currentVersionId ?? undefined,
                    uploadedById: sessionUser.sub,
                    origin: 'DESIGN',
                    category: 'DESIGN_SOURCE',
                    originalName: file.originalName,
                    mimeType: file.mimeType,
                    sizeBytes: BigInt(Math.round((file.base64Content.length * 3) / 4)),
                    base64Content: file.base64Content,
                    notes: file.notes ?? '',
                },
                select: {
                    id: true,
                    originalName: true,
                    mimeType: true,
                    sizeBytes: true,
                    base64Content: true,
                    notes: true,
                    createdAt: true,
                },
            }),
        ),
    )

    return saved.map((f) => ({
        id: f.id,
        originalName: f.originalName,
        mimeType: f.mimeType,
        sizeBytes: Number(f.sizeBytes),
        base64Content: f.base64Content,
        notes: f.notes,
        createdAt: f.createdAt.toISOString(),
    }))
})
