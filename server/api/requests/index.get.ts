import dayjs from 'dayjs'
import { getAllDesignRequests } from '../../repositories/design-requests.repository'
import { getSessionUser } from '../../utils/auth-session.util'

const serialize = (req: Awaited<ReturnType<typeof getAllDesignRequests>>[number]) => {
    const v = req.currentVersion
    return {
        // identifiers
        id: req.id,
        code: req.code,
        requestCode: req.code,

        // header
        title: req.title ?? '',
        clientId: req.clientId,
        clientName: req.client?.name ?? '',
        sellerId: req.sellerId,
        requestedBy: req.seller?.fullName ?? '',
        vendorName: req.seller?.fullName ?? '',

        // product
        brandName: req.brandName ?? '',
        productName: req.productName ?? '',

        // status & priority
        priority: req.priority,
        status: req.status,

        // dates
        requiredDate: req.requiredDate ? dayjs(req.requiredDate).toISOString() : null,
        createdAt: dayjs(req.createdAt).toISOString(),

        // version — technical specs (flattened)
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

        // Checklist
        artCompleted: v?.artCompleted ?? false,
        mechanicalCompleted: v?.mechanicalCompleted ?? false,
        dummyCompleted: v?.dummyCompleted ?? false,

        // relations
        assignedDesigners: (v?.assignments ?? []).map((a: any) => ({
            designerId: a.designerId,
            designerName: a.designer?.fullName ?? '',
        })),
        sampleFiles: [],
        attachments: [],
    }
}

export default defineEventHandler(async (event) => {
    const sessionUser = getSessionUser(event)
    const allRequests = await getAllDesignRequests()

    let filtered = allRequests

    if (sessionUser?.roleCodes.includes('disenador')) {
        filtered = allRequests.filter((r) =>
            r.currentVersion?.assignments.some(
                (a: { designerId: string }) => a.designerId === sessionUser.sub,
            ),
        )
    } else if (sessionUser?.roleCodes.includes('vendedor')) {
        filtered = allRequests.filter((r) => r.sellerId === sessionUser.sub)
    }

    return filtered.map(serialize)
})
