import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { randomBytes, scrypt } from 'node:crypto'
import { promisify } from 'node:util'

const pool = new Pool({ connectionString: process.env.SUPABASE_DB_URL })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })
const scryptAsync = promisify(scrypt)

const hashPassword = async (plain) => {
    const salt = randomBytes(16)
    const key = await scryptAsync(plain, salt, 64)
    return `scrypt$${salt.toString('base64')}$${key.toString('base64')}`
}

const roles = [
    {
        name: 'Administrador',
        code: 'admin',
        description: 'Acceso total al sistema.',
        isSystem: true,
    },
    {
        name: 'Vendedor',
        code: 'vendedor',
        description: 'Crea solicitudes y gestiona clientes.',
        isSystem: true,
    },
    {
        name: 'Diseñador Jefe',
        code: 'disenador_jefe',
        description: 'Asigna solicitudes y aprueba diseños.',
        isSystem: true,
    },
    {
        name: 'Diseñador',
        code: 'disenador',
        description: 'Trabaja en los diseños asignados.',
        isSystem: true,
    },
    {
        name: 'Calidad',
        code: 'calidad',
        description: 'Valida diseños para producción.',
        isSystem: true,
    },
]

const permissions = [
    { resource: 'users', action: 'read', name: 'Ver usuarios', code: 'users:read' },
    { resource: 'users', action: 'create', name: 'Crear usuarios', code: 'users:create' },
    { resource: 'users', action: 'update', name: 'Actualizar usuarios', code: 'users:update' },
    { resource: 'users', action: 'delete', name: 'Eliminar usuarios', code: 'users:delete' },
    { resource: 'roles', action: 'read', name: 'Ver roles', code: 'roles:read' },
    {
        resource: 'roles',
        action: 'manage',
        name: 'Administrar roles y permisos',
        code: 'roles:manage',
    },
    { resource: 'clients', action: 'read', name: 'Ver clientes', code: 'clients:read' },
    { resource: 'clients', action: 'create', name: 'Crear clientes', code: 'clients:create' },
    { resource: 'clients', action: 'update', name: 'Actualizar clientes', code: 'clients:update' },
    { resource: 'clients', action: 'delete', name: 'Eliminar clientes', code: 'clients:delete' },
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
    { resource: 'requests', action: 'assign', name: 'Asignar diseñador', code: 'requests:assign' },
    { resource: 'workflow', action: 'read', name: 'Ver workflow', code: 'workflow:read' },
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
    admin: permissions.map((p) => p.code),
    vendedor: [
        'clients:read',
        'clients:create',
        'clients:update',
        'requests:read',
        'requests:create',
        'requests:update',
        'workflow:read',
    ],
    disenador_jefe: [
        'users:read',
        'clients:read',
        'requests:read',
        'requests:update',
        'requests:assign',
        'workflow:read',
        'workflow:update',
        'workflow:approve',
        'workflow:reject',
    ],
    disenador: ['clients:read', 'requests:read', 'workflow:read', 'workflow:update'],
    calidad: [
        'clients:read',
        'requests:read',
        'workflow:read',
        'workflow:update',
        'workflow:approve',
        'workflow:reject',
    ],
}

const users = [
    // Administración
    {
        employeeCode: 'EMP-1001',
        fullName: 'Carlos Ruiz',
        email: 'admin@ruasa.com.sv',
        phone: '+503 7000-0001',
        department: 'Dirección',
        status: 'ACTIVE',
        password: '12345678',
        mustChangePassword: false,
        roleCode: 'admin',
    },
    // Vendedores
    {
        employeeCode: 'EMP-1002',
        fullName: 'Andrea Martínez',
        email: 'vendedor@ruasa.com.sv',
        phone: '+503 7000-0002',
        department: 'Comercial',
        status: 'ACTIVE',
        password: '12345678',
        mustChangePassword: false,
        roleCode: 'vendedor',
    },
    {
        employeeCode: 'EMP-1006',
        fullName: 'Roberto Sánchez',
        email: 'vendedor2@ruasa.com.sv',
        phone: '+503 7000-0006',
        department: 'Comercial',
        status: 'ACTIVE',
        password: '12345678',
        mustChangePassword: false,
        roleCode: 'vendedor',
    },
    // Calidad
    {
        employeeCode: 'EMP-1003',
        fullName: 'Elena Córdova',
        email: 'calidad@ruasa.com.sv',
        phone: '+503 7000-0003',
        department: 'Aseguramiento',
        status: 'ACTIVE',
        password: '12345678',
        mustChangePassword: false,
        roleCode: 'calidad',
    },
    // Diseñadores
    {
        employeeCode: 'EMP-1004',
        fullName: 'Carlos Arévalo',
        email: 'disenador@ruasa.com.sv',
        phone: '+503 7000-0004',
        department: 'Preprensa',
        status: 'ACTIVE',
        password: '12345678',
        mustChangePassword: false,
        roleCode: 'disenador',
    },
    {
        employeeCode: 'EMP-1007',
        fullName: 'Lucía Hernández',
        email: 'disenador2@ruasa.com.sv',
        phone: '+503 7000-0007',
        department: 'Preprensa',
        status: 'ACTIVE',
        password: '12345678',
        mustChangePassword: false,
        roleCode: 'disenador',
    },
    {
        employeeCode: 'EMP-1008',
        fullName: 'Jorge Quintanilla',
        email: 'disenador3@ruasa.com.sv',
        phone: '+503 7000-0008',
        department: 'Preprensa',
        status: 'ACTIVE',
        password: '12345678',
        mustChangePassword: false,
        roleCode: 'disenador',
    },
    {
        employeeCode: 'EMP-1009',
        fullName: 'Sofía Ramos',
        email: 'disenador4@ruasa.com.sv',
        phone: '+503 7000-0009',
        department: 'Preprensa',
        status: 'ACTIVE',
        password: '12345678',
        mustChangePassword: false,
        roleCode: 'disenador',
    },
    {
        employeeCode: 'EMP-1010',
        fullName: 'Miguel Ángel Torres',
        email: 'disenador5@ruasa.com.sv',
        phone: '+503 7000-0010',
        department: 'Preprensa',
        status: 'ACTIVE',
        password: '12345678',
        mustChangePassword: false,
        roleCode: 'disenador',
    },
    // Jefe de Diseño
    {
        employeeCode: 'EMP-1005',
        fullName: 'Mariana Flores',
        email: 'disenador.jefe@ruasa.com.sv',
        phone: '+503 7000-0005',
        department: 'Preprensa',
        status: 'ACTIVE',
        password: '12345678',
        mustChangePassword: false,
        roleCode: 'disenador_jefe',
    },
]

async function run() {
    // 1. Roles
    for (const r of roles) {
        await prisma.role.upsert({ where: { code: r.code }, create: r, update: r })
    }
    console.log('✓ Roles sembrados')

    // 2. Usuarios + rol asignado
    for (const u of users) {
        const passwordHash = await hashPassword(u.password)
        const saved = await prisma.authUser.upsert({
            where: { employeeCode: u.employeeCode },
            create: {
                employeeCode: u.employeeCode,
                fullName: u.fullName,
                email: u.email,
                phone: u.phone,
                department: u.department,
                status: u.status,
                passwordHash,
                mustChangePassword: u.mustChangePassword,
            },
            update: {
                fullName: u.fullName,
                email: u.email,
                phone: u.phone,
                department: u.department,
                status: u.status,
                passwordHash,
                mustChangePassword: u.mustChangePassword,
            },
        })
        const role = await prisma.role.findUnique({ where: { code: u.roleCode } })
        if (!role) continue
        await prisma.userRole.upsert({
            where: { userId_roleId: { userId: saved.id, roleId: role.id } },
            create: { userId: saved.id, roleId: role.id },
            update: {},
        })
        console.log(`  → ${u.fullName} (${u.roleCode})`)
    }
    console.log('✓ Usuarios sembrados')
}

run()
    .then(async () => {
        await prisma.$disconnect()
        await pool.end()
        console.log('\nSeed de usuarios completado.')
    })
    .catch(async (err) => {
        await prisma.$disconnect()
        await pool.end()
        console.error('Error en seed:', err)
        process.exit(1)
    })
