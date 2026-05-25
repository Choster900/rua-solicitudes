import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL is required to run seed.')
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

const requestsSeed = [
    {
        requestCode: 'SOL-2026-001',
        clientName: 'Empaques Centro S.A. de C.V.',
        brandName: 'FreshBox',
        productName: 'Caja para galletas',
        requestedBy: 'Jorge Quintanilla',
        vendorName: 'Jorge Quintanilla',
        materialType: 'Cartulina SBS',
        materialWeight: '350 g/m2',
        printTechnique: 'Offset',
        colorMode: 'CMYK',
        pantoneReferences: 'PANTONE 186C',
        finishingOptions: ['Barniz UV'],
        deliverables: ['Arte final', 'PDF impresión'],
        dimensions: '25 x 18 x 6 cm',
        quantity: 5000,
        requiredDate: new Date('2026-06-15T00:00:00.000Z'),
        priority: 'Alta',
        status: 'En diseño',
        designInstructions: 'Mantener lineamientos de marca y área de seguridad.',
        visualReferences: 'https://example.com/referencia-freshbox',
        requireDieCut: true,
        requireMockup: true,
        attachments: [
            { id: 'att-100', name: 'logo.ai', extension: 'ai', sizeKb: 512 },
            { id: 'att-101', name: 'brief.pdf', extension: 'pdf', sizeKb: 280 },
        ],
    },
]

const createWorkflowFromRequest = (requestId, requestCode) => {
    const nowIso = new Date().toISOString()

    return {
        requestId,
        stage: 'DESIGN_IN_PROGRESS',
        checklist: {
            briefValidated: true,
            technicalSpecsValidated: true,
            assetsValidated: true,
            legalValidated: false,
        },
        observations: [],
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
                actorName: 'Jorge Quintanilla',
                actorRole: 'Disenador',
                action: 'Diseño tomado',
                fromStage: 'NEW',
                toStage: 'DESIGN_IN_PROGRESS',
                comment: 'Se valida troquel y áreas de seguridad.',
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

async function seedRequestsAndWorkflow() {
    for (const request of requestsSeed) {
        const createdRequest = await prisma.designRequest.upsert({
            where: { requestCode: request.requestCode },
            create: request,
            update: request,
        })

        const workflow = createWorkflowFromRequest(createdRequest.id, createdRequest.requestCode)
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
