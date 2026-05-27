import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { randomBytes, scrypt } from 'node:crypto'
import { promisify } from 'node:util'

const connectionString = process.env.SUPABASE_DB_URL

if (!connectionString) {
    throw new Error('SUPABASE_DB_URL is required to run seed.')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const scryptAsync = promisify(scrypt)
const KEY_LENGTH = 64
const SALT_LENGTH = 16

const hashPassword = async (plain) => {
    const salt = randomBytes(SALT_LENGTH)
    const derivedKey = await scryptAsync(plain, salt, KEY_LENGTH)
    return `scrypt$${salt.toString('base64')}$${derivedKey.toString('base64')}`
}

const ROLE_CODES = {
    ADMIN: 'admin',
    VENDEDOR: 'vendedor',
    DISENADOR_JEFE: 'disenador_jefe',
    DISENADOR: 'disenador',
    CALIDAD: 'calidad',
}

const roleSeed = [
    {
        name: 'Administrador',
        code: ROLE_CODES.ADMIN,
        description: 'Acceso total al sistema, gestión de usuarios y permisos.',
        isSystem: true,
    },
    {
        name: 'Vendedor',
        code: ROLE_CODES.VENDEDOR,
        description: 'Crea solicitudes y gestiona su cartera de clientes.',
        isSystem: true,
    },
    {
        name: 'Diseñador Jefe',
        code: ROLE_CODES.DISENADOR_JEFE,
        description: 'Asigna solicitudes a diseñadores y aprueba diseños.',
        isSystem: true,
    },
    {
        name: 'Diseñador',
        code: ROLE_CODES.DISENADOR,
        description: 'Trabaja en los diseños asignados y actualiza el workflow.',
        isSystem: true,
    },
    {
        name: 'Calidad',
        code: ROLE_CODES.CALIDAD,
        description: 'Valida diseños finalizados y aprueba para producción.',
        isSystem: true,
    },
]

const permissionSeed = [
    // users
    { resource: 'users', action: 'read', name: 'Ver usuarios', code: 'users:read' },
    { resource: 'users', action: 'create', name: 'Crear usuarios', code: 'users:create' },
    { resource: 'users', action: 'update', name: 'Actualizar usuarios', code: 'users:update' },
    { resource: 'users', action: 'delete', name: 'Eliminar usuarios', code: 'users:delete' },
    // roles
    { resource: 'roles', action: 'read', name: 'Ver roles', code: 'roles:read' },
    {
        resource: 'roles',
        action: 'manage',
        name: 'Administrar roles y permisos',
        code: 'roles:manage',
    },
    // clients
    { resource: 'clients', action: 'read', name: 'Ver clientes', code: 'clients:read' },
    { resource: 'clients', action: 'create', name: 'Crear clientes', code: 'clients:create' },
    { resource: 'clients', action: 'update', name: 'Actualizar clientes', code: 'clients:update' },
    { resource: 'clients', action: 'delete', name: 'Eliminar clientes', code: 'clients:delete' },
    // vendors
    { resource: 'vendors', action: 'read', name: 'Ver vendedores', code: 'vendors:read' },
    { resource: 'vendors', action: 'create', name: 'Crear vendedores', code: 'vendors:create' },
    {
        resource: 'vendors',
        action: 'update',
        name: 'Actualizar vendedores',
        code: 'vendors:update',
    },
    { resource: 'vendors', action: 'delete', name: 'Eliminar vendedores', code: 'vendors:delete' },
    // requests
    { resource: 'requests', action: 'read', name: 'Ver solicitudes', code: 'requests:read' },
    { resource: 'requests', action: 'create', name: 'Crear solicitudes', code: 'requests:create' },
    {
        resource: 'requests',
        action: 'update',
        name: 'Actualizar solicitudes',
        code: 'requests:update',
    },
    {
        resource: 'requests',
        action: 'delete',
        name: 'Eliminar solicitudes',
        code: 'requests:delete',
    },
    {
        resource: 'requests',
        action: 'assign',
        name: 'Asignar diseñador a solicitud',
        code: 'requests:assign',
    },
    // workflow
    {
        resource: 'workflow',
        action: 'read',
        name: 'Ver workflow de solicitudes',
        code: 'workflow:read',
    },
    {
        resource: 'workflow',
        action: 'update',
        name: 'Actualizar workflow',
        code: 'workflow:update',
    },
    {
        resource: 'workflow',
        action: 'approve',
        name: 'Aprobar etapa del workflow',
        code: 'workflow:approve',
    },
    {
        resource: 'workflow',
        action: 'reject',
        name: 'Rechazar etapa del workflow',
        code: 'workflow:reject',
    },
]

const rolePermissionMatrix = {
    [ROLE_CODES.ADMIN]: permissionSeed.map((p) => p.code),
    [ROLE_CODES.VENDEDOR]: [
        'clients:read',
        'clients:create',
        'clients:update',
        'vendors:read',
        'requests:read',
        'requests:create',
        'requests:update',
        'workflow:read',
    ],
    [ROLE_CODES.DISENADOR_JEFE]: [
        'users:read',
        'clients:read',
        'vendors:read',
        'requests:read',
        'requests:update',
        'requests:assign',
        'workflow:read',
        'workflow:update',
        'workflow:approve',
        'workflow:reject',
    ],
    [ROLE_CODES.DISENADOR]: ['clients:read', 'requests:read', 'workflow:read', 'workflow:update'],
    [ROLE_CODES.CALIDAD]: [
        'clients:read',
        'requests:read',
        'workflow:read',
        'workflow:update',
        'workflow:approve',
        'workflow:reject',
    ],
}

const authUsersSeed = [
    {
        employeeCode: 'EMP-1001',
        fullName: 'Carlos Ruiz',
        email: 'admin@ruasa.com.sv',
        phone: '+503 7000-0001',
        department: 'Dirección',
        status: 'Activo',
        plainPassword: '12345678',
        mustChangePassword: false,
        roleCode: ROLE_CODES.ADMIN,
    },
    {
        employeeCode: 'EMP-1002',
        fullName: 'Andrea Martínez',
        email: 'vendedor@ruasa.com.sv',
        phone: '+503 7000-0002',
        department: 'Comercial',
        status: 'Activo',
        plainPassword: '12345678',
        mustChangePassword: false,
        roleCode: ROLE_CODES.VENDEDOR,
    },
    {
        employeeCode: 'EMP-1003',
        fullName: 'Elena Córdova',
        email: 'calidad@ruasa.com.sv',
        phone: '+503 7000-0003',
        department: 'Aseguramiento',
        status: 'Activo',
        plainPassword: '12345678',
        mustChangePassword: false,
        roleCode: ROLE_CODES.CALIDAD,
    },
    {
        employeeCode: 'EMP-1004',
        fullName: 'Carlos Arévalo',
        email: 'disenador@ruasa.com.sv',
        phone: '+503 7000-0004',
        department: 'Preprensa',
        status: 'Activo',
        plainPassword: '12345678',
        mustChangePassword: false,
        roleCode: ROLE_CODES.DISENADOR,
    },
    {
        employeeCode: 'EMP-1005',
        fullName: 'Mariana Flores',
        email: 'disenador.jefe@ruasa.com.sv',
        phone: '+503 7000-0005',
        department: 'Preprensa',
        status: 'Activo',
        plainPassword: '12345678',
        mustChangePassword: false,
        roleCode: ROLE_CODES.DISENADOR_JEFE,
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
                actorRoleCode: 'system',
                action: 'Solicitud registrada',
                fromStage: null,
                toStage: 'NEW',
                comment: 'Ingreso inicial de solicitud.',
                createdAt: nowIso,
            },
            {
                id: `audit-${requestCode}-002`,
                requestId,
                actorName: 'Carlos Arévalo',
                actorRoleCode: ROLE_CODES.DISENADOR,
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

async function seedPermissions() {
    for (const permission of permissionSeed) {
        await prisma.permission.upsert({
            where: { code: permission.code },
            create: permission,
            update: permission,
        })
    }
}

async function seedRolePermissions() {
    for (const [roleCode, permissionCodes] of Object.entries(rolePermissionMatrix)) {
        const role = await prisma.role.findUnique({ where: { code: roleCode } })
        if (!role) continue

        for (const permissionCode of permissionCodes) {
            const permission = await prisma.permission.findUnique({
                where: { code: permissionCode },
            })
            if (!permission) continue

            await prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: role.id,
                        permissionId: permission.id,
                    },
                },
                create: {
                    roleId: role.id,
                    permissionId: permission.id,
                },
                update: {},
            })
        }
    }
}

async function seedAuthUsersAndRoles() {
    for (const authUser of authUsersSeed) {
        const passwordHash = await hashPassword(authUser.plainPassword)

        const saved = await prisma.authUser.upsert({
            where: { email: authUser.email },
            create: {
                employeeCode: authUser.employeeCode,
                fullName: authUser.fullName,
                email: authUser.email,
                phone: authUser.phone,
                department: authUser.department,
                status: authUser.status,
                passwordHash,
                mustChangePassword: authUser.mustChangePassword,
            },
            update: {
                employeeCode: authUser.employeeCode,
                fullName: authUser.fullName,
                phone: authUser.phone,
                department: authUser.department,
                status: authUser.status,
                passwordHash,
                mustChangePassword: authUser.mustChangePassword,
            },
        })

        const role = await prisma.role.findUnique({ where: { code: authUser.roleCode } })
        if (!role) continue

        await prisma.userRole.upsert({
            where: {
                userId_roleId: {
                    userId: saved.id,
                    roleId: role.id,
                },
            },
            create: {
                userId: saved.id,
                roleId: role.id,
            },
            update: {},
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
    await seedPermissions()
    await seedRolePermissions()
    await seedAuthUsersAndRoles()
    await seedClients()
    await seedVendors()
    await seedRequestsAndWorkflow()
}

seed()
    .then(async () => {
        await prisma.$disconnect()
        await pool.end()
        console.log(
            'Seed completado: roles, permisos, role-permissions, usuarios+roles, clientes, vendedores, solicitudes y workflow.',
        )
    })
    .catch(async (error) => {
        await prisma.$disconnect()
        await pool.end()
        console.error('Seed failed:', error)
        process.exit(1)
    })
