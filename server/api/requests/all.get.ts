import dayjs from 'dayjs'
import { getAllDesignRequests } from '../../repositories/design-requests.repository'
import { requireSessionUser } from '../../utils/auth-session.util'

const serialize = (req: Awaited<ReturnType<typeof getAllDesignRequests>>[number]) => {
    const v = req.currentVersion
    return {
        id: req.id,
        code: req.code,
        requestCode: req.code,
        title: req.title ?? '',
        clientId: req.clientId,
        clientName: req.client?.name ?? '',
        sellerId: req.sellerId,
        requestedBy: req.seller?.fullName ?? '',
        vendorName: req.seller?.fullName ?? '',
        brandName: req.brandName ?? '',
        productName: req.productName ?? '',
        priority: req.priority,
        status: req.status,
        requiredDate: req.requiredDate ? dayjs(req.requiredDate).toISOString() : null,
        createdAt: dayjs(req.createdAt).toISOString(),
        versionNumber: v?.versionNumber ?? 1,
        materialType: v?.materialType ?? '',
        materialWeight: v?.materialWeight ?? '',
        closureType: v?.closureType ?? '',
        fluteType: v?.fluteType ?? '',
        fluteDirection: v?.fluteDirection ?? '',
        outerLiner: v?.outerLiner ?? '',
        innerLiner: v?.innerLiner ?? '',
        printTechnique: v?.closureType ?? '',
        colorMode: v?.colorMode ?? '',
        pantoneReferences: v?.pantoneReferences ?? '',
        dimensions: v
            ? `${v.length ?? '?'} x ${v.width ?? '?'} x ${v.height ?? '?'} ${v.dimensionUnit ?? 'cm'}`
            : '',
        length: v?.length != null ? Number(v.length) : null,
        width: v?.width != null ? Number(v.width) : null,
        height: v?.height != null ? Number(v.height) : null,
        dimensionUnit: v?.dimensionUnit ?? 'cm',
        quantity: v?.quantity ?? 0,
        finishingOptions: v?.finishingOptions ?? [],
        deliverables: v?.deliverables ?? [],
        designInstructions: v?.designInstructions ?? '',
        visualReferences: v?.visualReferences ?? '',
        requireDieCut: v?.requireDieCut ?? false,
        requireMockup: v?.requireMockup ?? false,
        artCompleted: v?.artCompleted ?? false,
        mechanicalCompleted: v?.mechanicalCompleted ?? false,
        dummyCompleted: v?.dummyCompleted ?? false,
        assignedDesigners: (v?.assignments ?? []).map((a: any) => ({
            designerId: a.designerId,
            designerName: a.designer?.fullName ?? '',
        })),
        sampleFiles: (req.files ?? [])
            .filter((f: any) => f.origin === 'SALES')
            .map((f: any) => ({
                id: f.id,
                originalName: f.originalName,
                mimeType: f.mimeType,
                sizeBytes: Number(f.sizeBytes),
                base64Content: f.base64Content,
                notes: f.notes,
                createdAt: dayjs(f.createdAt).toISOString(),
            })),
        attachments: (req.files ?? [])
            .filter((f: any) => f.origin === 'DESIGN')
            .map((f: any) => ({
                id: f.id,
                originalName: f.originalName,
                mimeType: f.mimeType,
                sizeBytes: Number(f.sizeBytes),
                base64Content: f.base64Content,
                notes: f.notes,
                createdAt: dayjs(f.createdAt).toISOString(),
            })),
        qualityHistory: (req.versions ?? [])
            .flatMap((ver: any) =>
                (ver.qualityReviews ?? []).map((qr: any) => ({
                    id: qr.id,
                    versionNumber: ver.versionNumber,
                    decision: qr.decision as 'APPROVED' | 'REJECTED',
                    generalObservations: qr.generalObservations ?? '',
                    reviewedAt: dayjs(qr.reviewedAt).toISOString(),
                    reviewedBy: qr.reviewedBy?.fullName ?? '',
                })),
            )
            .sort(
                (a: any, b: any) =>
                    new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime(),
            ),
    }
}

export default defineEventHandler(async (event) => {
    requireSessionUser(event)

    try {
        const requests = await getAllDesignRequests()
        return requests.map(serialize)
    } catch (error) {
        console.error('[GET /api/requests/all] Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al obtener solicitudes.',
            data: error instanceof Error ? error.message : String(error),
        })
    }
})
