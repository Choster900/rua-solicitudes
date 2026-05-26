import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.SUPABASE_DB_URL

if (!connectionString) {
    throw new Error('SUPABASE_DB_URL is required to run seed.')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const roleSeed = [
    { name: 'Administrador', code: 'admin', description: 'Perfil administrativo', isSystem: true },
    { name: 'Vendedor', code: 'vendedor', description: 'Perfil comercial', isSystem: false },
    {
        name: 'Calidad',
        code: 'calidad',
        description: 'Perfil de control de calidad',
        isSystem: false,
    },
    { name: 'Disenador', code: 'disenador', description: 'Perfil de diseno', isSystem: false },
]

const authUsersSeed = [
    {
        employeeCode: 'EMP-1001',
        fullName: 'Carlos Ruiz',
        email: 'admin@ruasa.com.sv',
        phone: '+503 7000-0001',
        userType: 'Administrador',
        department: 'Dirección',
        status: 'Activo',
        password: '12345678',
        mustChangePassword: false,
    },
    {
        employeeCode: 'EMP-1002',
        fullName: 'Andrea Martínez',
        email: 'vendedor@ruasa.com.sv',
        phone: '+503 7000-0002',
        userType: 'Vendedor',
        department: 'Comercial',
        status: 'Activo',
        password: '12345678',
        mustChangePassword: false,
    },
    {
        employeeCode: 'EMP-1003',
        fullName: 'Elena Córdova',
        email: 'calidad@ruasa.com.sv',
        phone: '+503 7000-0003',
        userType: 'Calidad',
        department: 'Aseguramiento',
        status: 'Activo',
        password: '12345678',
        mustChangePassword: false,
    },
    {
        employeeCode: 'EMP-1004',
        fullName: 'Carlos Arévalo',
        email: 'disenador@ruasa.com.sv',
        phone: '+503 7000-0004',
        userType: 'Diseñador',
        department: 'Preprensa',
        status: 'Activo',
        password: '12345678',
        mustChangePassword: false,
    },
    {
        employeeCode: 'EMP-1005',
        fullName: 'Aileen García',
        email: 'aileen@ruasa.com.sv',
        phone: '+503 7000-0005',
        userType: 'Diseñador',
        department: 'Preprensa',
        status: 'Activo',
        password: '12345678',
        mustChangePassword: false,
    },
    {
        employeeCode: 'EMP-1006',
        fullName: 'Mauricio Salazar',
        email: 'jefedisenio@ruasa.com.sv',
        phone: '+503 7000-0006',
        userType: 'JefeDiseño',
        department: 'Preprensa',
        status: 'Activo',
        password: '12345678',
        mustChangePassword: false,
    },
]

const clientsSeed = [
    {
        code: 'CLI-100',
        name: 'Empaques Centro S.A. de C.V.',
        taxId: '0614-220394-101-3',
        segment: 'Alimentos',
        contactName: 'Marta Rodríguez',
        contactEmail: 'marta@empaquescentro.com',
        contactPhone: '+503 7100-1000',
        country: 'El Salvador',
        department: 'San Salvador',
        city: 'San Salvador',
        addressLine: 'Blvd. Constitución, local 10',
        addressReference: 'Frente a centro comercial',
        website: 'https://empaquescentro.com',
        googleMapsUrl: 'https://maps.google.com/?q=San+Salvador',
        notes: 'Cliente estratégico.',
        status: 'Activo',
    },
    {
        code: 'CLI-101',
        name: 'Distribuidora Pacífico',
        taxId: '0614-150208-101-4',
        segment: 'Higiene',
        contactName: 'Roberto Herrera',
        contactEmail: 'roberto@distribuidorapacifico.com',
        contactPhone: '+503 7111-2233',
        country: 'El Salvador',
        department: 'La Libertad',
        city: 'Santa Tecla',
        addressLine: 'Km 12.5 Carretera al Puerto',
        addressReference: '',
        website: '',
        googleMapsUrl: '',
        notes: '',
        status: 'Prospecto',
    },
]

const vendorsSeed = [
    {
        code: 'VEN-001',
        fullName: 'Jorge Quintanilla',
        zone: 'Centro',
        phone: '+503 7222-1000',
        email: 'jorge.q@ruasa.com.sv',
        assignedClientCodes: ['CLI-100', 'CLI-101'],
        monthlySalesUsd: 42000,
        status: 'Activo',
    },
    {
        code: 'VEN-002',
        fullName: 'Ana López',
        zone: 'Occidente',
        phone: '+503 7222-2000',
        email: 'ana.l@ruasa.com.sv',
        assignedClientCodes: ['CLI-100'],
        monthlySalesUsd: 27500,
        status: 'Activo',
    },
]

const requestCatalogSeed = {
    closureTypes: ['Tapa y Fondo', 'Autoarmable', 'Pegado lateral'],
    fluteTypes: ['C', 'B', 'E'],
    fluteDirections: ['Vertical', 'Horizontal'],
    finishingOptions: ['Barniz UV', 'Laminado Mate', 'Hot Stamping', 'Relieve'],
}

const requestsSeed = [
    {
        requestCode: 'SOL-2026-001',
        clientName: 'Empaques Centro S.A. de C.V.',
        brandName: 'FreshBox',
        productName: 'Caja para galletas',
        requestedBy: 'Jorge Quintanilla',
        vendorName: 'Jorge Quintanilla',
        materialType: 'C',
        materialWeight: 'ECT 32 / 1.6',
        fluteDirection: 'Vertical',
        outerLiner: 'Kraft 200',
        innerLiner: 'Blanco 180',
        printTechnique: 'Tapa y Fondo',
        colorMode: 'Pantone',
        pantoneReferences: 'PANTONE 186C',
        finishingOptions: ['Barniz UV', 'Laminado Mate'],
        deliverables: ['Arte final', 'Plano de troquel'],
        dimensions: '320 x 230 x 120',
        quantity: 2500,
        requiredDate: new Date('2026-06-15T00:00:00.000Z'),
        priority: 'Alta',
        status: 'IN_DESIGN',
        designInstructions: 'Mantener lineamientos de marca y área de seguridad.',
        visualReferences: 'https://example.com/referencia-freshbox',
        requireArt: true,
        requireDieCut: true,
        requireMockup: true,
        attachments: [
            { id: 'att-100', name: 'logo.ai', extension: 'ai', sizeKb: 512 },
            { id: 'att-101', name: 'brief.pdf', extension: 'pdf', sizeKb: 280 },
        ],
    },
    {
        requestCode: 'SOL-2026-002',
        clientName: 'Distribuidora Pacífico',
        brandName: 'Pacífico Clean',
        productName: 'Caja master detergente',
        requestedBy: 'Ana López',
        vendorName: 'Ana López',
        materialType: 'B',
        materialWeight: 'ECT 29 / 1.4',
        fluteDirection: 'Horizontal',
        outerLiner: 'Kraft 180',
        innerLiner: 'Test 150',
        printTechnique: 'Autoarmable',
        colorMode: 'CMYK',
        pantoneReferences: '',
        finishingOptions: ['Relieve'],
        deliverables: ['Arte final'],
        dimensions: '410 x 280 x 260',
        quantity: 1400,
        requiredDate: new Date('2026-06-25T00:00:00.000Z'),
        priority: 'Media',
        status: 'PENDING_ASSIGNMENT',
        designInstructions: 'Optimizar para estiba en pallet estándar.',
        visualReferences: '',
        requireArt: true,
        requireDieCut: false,
        requireMockup: false,
        attachments: [{ id: 'att-200', name: 'manual-marca.pdf', extension: 'pdf', sizeKb: 190 }],
    },
    {
        requestCode: 'SOL-2026-003',
        clientName: 'Empaques Centro S.A. de C.V.',
        brandName: 'SnaxPro',
        productName: 'Caja exhibidora snacks',
        requestedBy: 'Jorge Quintanilla',
        vendorName: 'Jorge Quintanilla',
        materialType: 'E',
        materialWeight: 'ECT 24 / 1.1',
        fluteDirection: 'Vertical',
        outerLiner: 'Blanco 170',
        innerLiner: 'Kraft 125',
        printTechnique: 'Pegado lateral',
        colorMode: 'Pantone',
        pantoneReferences: 'PANTONE 286C',
        finishingOptions: ['Barniz UV', 'Hot Stamping'],
        deliverables: ['Arte final', 'Mockup 3D'],
        dimensions: '260 x 160 x 210',
        quantity: 3200,
        requiredDate: new Date('2026-06-18T00:00:00.000Z'),
        priority: 'Alta',
        status: 'IN_QUALITY_REVIEW',
        designInstructions: 'Incluir zona troquelada para ventana frontal.',
        visualReferences: 'https://example.com/referencia-snaxpro',
        requireArt: true,
        requireDieCut: true,
        requireMockup: true,
        attachments: [
            { id: 'att-300', name: 'snaxpro-brandguide.pdf', extension: 'pdf', sizeKb: 244 },
        ],
    },
    {
        requestCode: 'SOL-2026-004',
        clientName: 'Empaques Centro S.A. de C.V.',
        brandName: 'BioPack',
        productName: 'Caja farmacia',
        requestedBy: 'Andrea Martínez',
        vendorName: 'Ana López',
        materialType: 'C',
        materialWeight: 'ECT 32 / 1.6',
        fluteDirection: 'Vertical',
        outerLiner: 'Blanco 200',
        innerLiner: 'Test 150',
        printTechnique: 'Tapa y Fondo',
        colorMode: 'CMYK',
        pantoneReferences: '',
        finishingOptions: ['Laminado Mate'],
        deliverables: ['Arte final'],
        dimensions: '180 x 140 x 90',
        quantity: 8000,
        requiredDate: new Date('2026-06-10T00:00:00.000Z'),
        priority: 'Baja',
        status: 'APPROVED',
        designInstructions: 'Validar textos legales y lote en panel lateral.',
        visualReferences: '',
        requireArt: true,
        requireDieCut: false,
        requireMockup: false,
        attachments: [{ id: 'att-400', name: 'artes-previos.zip', extension: 'zip', sizeKb: 780 }],
    },
]

const toWorkflowStage = (status) => {
    if (status === 'APPROVED') {
        return 'APPROVED'
    }

    if (status === 'IN_QUALITY_REVIEW') {
        return 'QUALITY_IN_REVIEW'
    }

    if (status === 'IN_DESIGN') {
        return 'DESIGN_IN_PROGRESS'
    }

    if (status === 'REJECTED') {
        return 'REJECTED_BY_QUALITY'
    }

    return 'NEW'
}

const createWorkflowFromRequest = (requestId, requestCode, status) => {
    const nowIso = new Date().toISOString()
    const stage = toWorkflowStage(status)
    const isPending = status === 'PENDING_ASSIGNMENT'

    return {
        requestId,
        stage,
        checklist: {
            briefValidated: !isPending,
            technicalSpecsValidated: status === 'IN_QUALITY_REVIEW' || status === 'APPROVED',
            assetsValidated: !isPending,
            legalValidated: false,
        },
        observations:
            stage === 'QUALITY_IN_REVIEW' ? ['Pendiente validación final de calidad.'] : [],
        auditTrail: [
            {
                id: `audit-${requestCode}-001`,
                requestId,
                actorName: 'Sistema',
                actorRole: 'Sistema',
                action: 'Solicitud registrada',
                fromStage: null,
                toStage: 'NEW',
                comment: 'Ingreso inicial de solicitud.',
                createdAt: nowIso,
            },
            {
                id: `audit-${requestCode}-002`,
                requestId,
                actorName: 'Sistema',
                actorRole: 'Sistema',
                action: 'Estado sincronizado',
                fromStage: 'NEW',
                toStage: stage,
                comment: `Estado inicial: ${status}.`,
                createdAt: nowIso,
            },
        ],
    }
}

async function seedRoles() {
    for (const role of roleSeed) {
        await prisma.role.upsert({
            where: { code: role.code },
            create: role,
            update: role,
        })
    }
}

async function seedAuthUsers() {
    for (const authUser of authUsersSeed) {
        await prisma.authUser.upsert({
            where: { email: authUser.email },
            create: authUser,
            update: authUser,
        })
    }
}

async function seedClients() {
    for (const client of clientsSeed) {
        await prisma.client.upsert({
            where: { code: client.code },
            create: client,
            update: client,
        })
    }
}

async function seedVendors() {
    for (const vendor of vendorsSeed) {
        await prisma.vendor.upsert({
            where: { code: vendor.code },
            create: vendor,
            update: vendor,
        })
    }
}

async function seedRequestCatalogs() {
    for (const name of requestCatalogSeed.closureTypes) {
        await prisma.requestClosureType.upsert({
            where: { name },
            create: { name },
            update: { isActive: true },
        })
    }

    for (const name of requestCatalogSeed.fluteTypes) {
        await prisma.requestFluteType.upsert({
            where: { name },
            create: { name },
            update: { isActive: true },
        })
    }

    for (const name of requestCatalogSeed.fluteDirections) {
        await prisma.requestFluteDirection.upsert({
            where: { name },
            create: { name },
            update: { isActive: true },
        })
    }

    for (const name of requestCatalogSeed.finishingOptions) {
        await prisma.requestFinishingOption.upsert({
            where: { name },
            create: { name },
            update: { isActive: true },
        })
    }
}

async function seedRequestsAndWorkflow() {
    const aileen = await prisma.authUser.findUnique({
        where: { email: 'aileen@ruasa.com.sv' },
    })
    const designLead = await prisma.authUser.findUnique({
        where: { email: 'jefedisenio@ruasa.com.sv' },
    })

    // Asignaciones demo por requestCode → diseñador
    const assignmentByCode =
        aileen && designLead
            ? {
                  'SOL-2026-001': { designerId: aileen.id, assignedById: designLead.id },
                  'SOL-2026-003': { designerId: aileen.id, assignedById: designLead.id },
                  'SOL-2026-004': { designerId: aileen.id, assignedById: designLead.id },
              }
            : {}

    for (const request of requestsSeed) {
        const assignment = assignmentByCode[request.requestCode]
        const enrichedRequest = assignment
            ? {
                  ...request,
                  assignedDesignerId: assignment.designerId,
                  assignedById: assignment.assignedById,
                  assignedAt: new Date(),
              }
            : request

        const createdRequest = await prisma.designRequest.upsert({
            where: { requestCode: request.requestCode },
            create: enrichedRequest,
            update: enrichedRequest,
        })

        if (assignment) {
            await prisma.designRequestVersion.upsert({
                where: {
                    requestId_versionNumber: {
                        requestId: createdRequest.id,
                        versionNumber: createdRequest.currentVersion,
                    },
                },
                create: {
                    requestId: createdRequest.id,
                    versionNumber: createdRequest.currentVersion,
                    designerId: assignment.designerId,
                    reviewStatus: request.status === 'APPROVED' ? 'APPROVED' : 'PENDING',
                },
                update: {
                    designerId: assignment.designerId,
                },
            })
        }

        const workflow = createWorkflowFromRequest(
            createdRequest.id,
            createdRequest.requestCode,
            request.status,
        )
        await prisma.requestWorkflow.upsert({
            where: { requestId: createdRequest.id },
            create: workflow,
            update: workflow,
        })
    }
}

async function seed() {
    await seedRoles()
    await seedAuthUsers()
    await seedClients()
    await seedVendors()
    await seedRequestCatalogs()
    await seedRequestsAndWorkflow()
}

seed()
    .then(async () => {
        await prisma.$disconnect()
        await pool.end()
        console.log('Seed completado: auth, clientes, vendedores, solicitudes y workflow.')
    })
    .catch(async (error) => {
        await prisma.$disconnect()
        await pool.end()
        console.error('Seed failed:', error)
        process.exit(1)
    })
