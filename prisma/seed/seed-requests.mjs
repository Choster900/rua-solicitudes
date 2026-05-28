/**
 * Crea solicitudes de diseño de prueba compatibles con el esquema actual.
 * Requiere que ya existan usuarios (AuthUser) y clientes (Client) en la base de datos.
 *
 * Uso: node prisma/seed/seed-requests.mjs
 */
import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.SUPABASE_DB_URL
if (!connectionString) throw new Error('SUPABASE_DB_URL is required.')

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// ─── Helpers ──────────────────────────────────────────────────────────────────

const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000)

const requestTemplates = [
    {
        codeSuffix: '001',
        title: 'Caja para galletas artesanales',
        brandName: 'FreshBox',
        productName: 'Caja galletas surtidas',
        priority: 'HIGH',
        status: 'IN_DESIGN',
        requiredDays: 20,
        version: {
            materialType: 'C',
            materialWeight: 'ECT 32 / 1.6',
            closureType: 'Tapa y Fondo',
            fluteType: 'C',
            fluteDirection: 'Vertical',
            outerLiner: 'Kraft 200',
            innerLiner: 'Blanco 180',
            colorMode: 'CMYK',
            pantoneReferences: 'PANTONE 186C',
            length: 32.0,
            width: 23.0,
            height: 12.0,
            dimensionUnit: 'cm',
            quantity: 2500,
            finishingOptions: ['Barniz UV', 'Laminado Mate'],
            deliverables: ['Arte final', 'Plano de troquel'],
            designInstructions: 'Mantener lineamientos de marca y área de seguridad de 5mm.',
            requireDieCut: true,
            requireMockup: true,
            artCompleted: true,
            mechanicalCompleted: false,
            dummyCompleted: false,
        },
    },
    {
        codeSuffix: '002',
        title: 'Master caja detergente líquido',
        brandName: 'Pacífico Clean',
        productName: 'Caja master detergente',
        priority: 'MEDIUM',
        status: 'PENDING_DESIGN_REVIEW',
        requiredDays: 35,
        version: {
            materialType: 'B',
            materialWeight: 'ECT 29 / 1.4',
            closureType: 'Autoarmable',
            fluteType: 'B',
            fluteDirection: 'Horizontal',
            outerLiner: 'Kraft 180',
            innerLiner: 'Test 150',
            colorMode: 'CMYK',
            pantoneReferences: '',
            length: 41.0,
            width: 28.0,
            height: 26.0,
            dimensionUnit: 'cm',
            quantity: 1400,
            finishingOptions: ['Relieve'],
            deliverables: ['Arte final'],
            designInstructions: 'Optimizar para estiba en pallet estándar.',
            requireDieCut: false,
            requireMockup: false,
            artCompleted: false,
            mechanicalCompleted: false,
            dummyCompleted: false,
        },
    },
    {
        codeSuffix: '003',
        title: 'Exhibidor de snacks para punto de venta',
        brandName: 'SnaxPro',
        productName: 'Caja exhibidora snacks',
        priority: 'URGENT',
        status: 'SENT_TO_QUALITY',
        requiredDays: 10,
        version: {
            materialType: 'E',
            materialWeight: 'ECT 24 / 1.1',
            closureType: 'Pegado lateral',
            fluteType: 'E',
            fluteDirection: 'Vertical',
            outerLiner: 'Blanco 170',
            innerLiner: 'Kraft 125',
            colorMode: 'Pantone',
            pantoneReferences: 'PANTONE 286C, PANTONE 123C',
            length: 26.0,
            width: 16.0,
            height: 21.0,
            dimensionUnit: 'cm',
            quantity: 3200,
            finishingOptions: ['Barniz UV', 'Hot Stamping'],
            deliverables: ['Arte final', 'Mockup 3D', 'Plano de troquel'],
            designInstructions:
                'Incluir zona troquelada para ventana frontal. Revisar área de visualización.',
            requireDieCut: true,
            requireMockup: true,
            artCompleted: true,
            mechanicalCompleted: true,
            dummyCompleted: true,
        },
    },
    {
        codeSuffix: '004',
        title: 'Empaque primario para farmacia',
        brandName: 'BioPack',
        productName: 'Caja farmacia plegadiza',
        priority: 'LOW',
        status: 'QUALITY_APPROVED',
        requiredDays: 45,
        version: {
            materialType: 'C',
            materialWeight: 'ECT 32 / 1.6',
            closureType: 'Tapa y Fondo',
            fluteType: 'C',
            fluteDirection: 'Vertical',
            outerLiner: 'Blanco 200',
            innerLiner: 'Test 150',
            colorMode: 'CMYK',
            pantoneReferences: '',
            length: 18.0,
            width: 14.0,
            height: 9.0,
            dimensionUnit: 'cm',
            quantity: 8000,
            finishingOptions: ['Laminado Mate'],
            deliverables: ['Arte final'],
            designInstructions: 'Validar textos legales y número de lote en panel lateral.',
            requireDieCut: false,
            requireMockup: false,
            artCompleted: true,
            mechanicalCompleted: true,
            dummyCompleted: true,
        },
    },
    {
        codeSuffix: '005',
        title: 'Display de mostrador para chocolates',
        brandName: 'ChocoPremium',
        productName: 'Display chocolates navidad',
        priority: 'HIGH',
        status: 'ASSIGNED_TO_DESIGNER',
        requiredDays: 25,
        version: {
            materialType: 'E',
            materialWeight: 'ECT 24 / 1.1',
            closureType: 'Pegado lateral',
            fluteType: 'E',
            fluteDirection: 'Vertical',
            outerLiner: 'Blanco 180',
            innerLiner: 'Kraft 150',
            colorMode: 'CMYK',
            pantoneReferences: 'PANTONE 877C (plata)',
            length: 30.0,
            width: 22.0,
            height: 35.0,
            dimensionUnit: 'cm',
            quantity: 500,
            finishingOptions: ['Hot Stamping', 'Barniz UV'],
            deliverables: ['Arte final', 'Mockup 3D'],
            designInstructions: 'Diseño navideño premium. Incluir foil dorado en logo.',
            requireDieCut: true,
            requireMockup: true,
            artCompleted: false,
            mechanicalCompleted: false,
            dummyCompleted: false,
        },
    },
    {
        codeSuffix: '006',
        title: 'Caja para cereal infantil',
        brandName: 'CerealKids',
        productName: 'Caja cereal colores',
        priority: 'MEDIUM',
        status: 'CREATED',
        requiredDays: 30,
        version: {
            materialType: 'C',
            materialWeight: 'ECT 29 / 1.4',
            closureType: 'Tapa y Fondo',
            fluteType: 'C',
            fluteDirection: 'Vertical',
            outerLiner: 'Blanco 200',
            innerLiner: 'Kraft 150',
            colorMode: 'CMYK',
            pantoneReferences: '',
            length: 28.0,
            width: 8.0,
            height: 32.0,
            dimensionUnit: 'cm',
            quantity: 5000,
            finishingOptions: ['Barniz UV'],
            deliverables: ['Arte final'],
            designInstructions: 'Colores vivos, tipografía redondeada, personaje animado central.',
            requireDieCut: false,
            requireMockup: true,
            artCompleted: false,
            mechanicalCompleted: false,
            dummyCompleted: false,
        },
    },
    {
        codeSuffix: '007',
        title: 'Bolsa kraft para panadería',
        brandName: 'PanArtesanal',
        productName: 'Bolsa kraft pan especial',
        priority: 'URGENT',
        status: 'CREATED',
        requiredDays: 7,
        version: {
            materialType: 'B',
            materialWeight: 'ECT 24 / 1.2',
            closureType: 'Pegado lateral',
            fluteType: 'B',
            fluteDirection: 'Horizontal',
            outerLiner: 'Kraft 180',
            innerLiner: 'Kraft 125',
            colorMode: 'CMYK',
            pantoneReferences: 'PANTONE 139C',
            length: 15.0,
            width: 8.0,
            height: 30.0,
            dimensionUnit: 'cm',
            quantity: 10000,
            finishingOptions: [],
            deliverables: ['Arte final'],
            designInstructions: 'Estilo rústico artesanal, ventana transparente en frente.',
            requireDieCut: false,
            requireMockup: false,
            artCompleted: false,
            mechanicalCompleted: false,
            dummyCompleted: false,
        },
    },
]

async function seedRequests() {
    // Buscar vendedor existente
    const vendedorRole = await prisma.role.findFirst({ where: { code: 'vendedor' } })
    const disenadorJefeRole = await prisma.role.findFirst({ where: { code: 'disenador_jefe' } })
    const disenadorRole = await prisma.role.findFirst({ where: { code: 'disenador' } })

    const vendedor = vendedorRole
        ? await prisma.authUser.findFirst({
              where: { userRoles: { some: { roleId: vendedorRole.id } } },
          })
        : null

    const disenadorJefe = disenadorJefeRole
        ? await prisma.authUser.findFirst({
              where: { userRoles: { some: { roleId: disenadorJefeRole.id } } },
          })
        : null

    const disenador = disenadorRole
        ? await prisma.authUser.findFirst({
              where: { userRoles: { some: { roleId: disenadorRole.id } } },
          })
        : null

    if (!vendedor) {
        console.error('❌ No se encontró un usuario vendedor. Ejecuta el seed principal primero.')
        return
    }

    // Buscar clientes
    const clients = await prisma.client.findMany({ take: 5 })
    if (!clients.length) {
        console.error('❌ No se encontraron clientes. Ejecuta el seed principal primero.')
        return
    }

    console.log(`✅ Vendedor: ${vendedor.fullName} (${vendedor.id})`)
    console.log(`✅ Clientes encontrados: ${clients.length}`)
    if (disenador) console.log(`✅ Diseñador: ${disenador.fullName}`)
    if (disenadorJefe) console.log(`✅ Jefe Diseño: ${disenadorJefe.fullName}`)

    const year = new Date().getFullYear()
    let created = 0
    let skipped = 0

    for (let i = 0; i < requestTemplates.length; i++) {
        const tmpl = requestTemplates[i]
        const code = `SOL-${year}-${tmpl.codeSuffix}`
        const client = clients[i % clients.length]
        const creator = vendedor

        // Evitar duplicados
        const existing = await prisma.designRequest.findUnique({ where: { code } })
        if (existing) {
            console.log(`⏭️  Ya existe: ${code}`)
            skipped++
            continue
        }

        // 1. Crear solicitud
        const request = await prisma.designRequest.create({
            data: {
                code,
                clientId: client.id,
                sellerId: creator.id,
                title: tmpl.title,
                brandName: tmpl.brandName,
                productName: tmpl.productName,
                priority: tmpl.priority,
                status: tmpl.status,
                requiredDate: daysFromNow(tmpl.requiredDays),
            },
        })

        // 2. Crear versión inicial
        const version = await prisma.designRequestVersion.create({
            data: {
                requestId: request.id,
                versionNumber: 1,
                createdById: creator.id,
                reason: 'INITIAL',
                status: 'IN_DESIGN',
                ...tmpl.version,
            },
        })

        // 3. Apuntar currentVersionId
        await prisma.designRequest.update({
            where: { id: request.id },
            data: { currentVersionId: version.id },
        })

        // 4. Asignar diseñador si aplica y existe
        const needsAssignment = [
            'ASSIGNED_TO_DESIGNER',
            'IN_DESIGN',
            'SENT_TO_QUALITY',
            'QUALITY_APPROVED',
        ].includes(tmpl.status)
        if (needsAssignment && disenador && disenadorJefe) {
            await prisma.requestDesignerAssignment.create({
                data: {
                    versionId: version.id,
                    designerId: disenador.id,
                    assignedById: disenadorJefe.id,
                    isLeadDesigner: true,
                    status: 'ACTIVE',
                },
            })
        }

        console.log(`✅ Creada: ${code} — ${tmpl.productName} (${tmpl.status})`)
        created++
    }

    console.log(`\n📊 Resumen: ${created} creadas, ${skipped} ya existían.`)
}

seedRequests()
    .then(async () => {
        await prisma.$disconnect()
        await pool.end()
    })
    .catch(async (error) => {
        console.error('❌ Seed de solicitudes falló:', error)
        await prisma.$disconnect()
        await pool.end()
        process.exit(1)
    })
