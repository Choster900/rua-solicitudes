import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const pool = new Pool({ connectionString: process.env.SUPABASE_DB_URL })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

const clients = [
    {
        code: 'CLI-001',
        name: 'Empaques Centro S.A. de C.V.',
        taxId: '0614-220394-101-3',
        contactName: 'Marta Rodríguez',
        contactEmail: 'marta@empaquescentro.com',
        contactPhone: '+503 7100-1000',
        country: 'El Salvador',
        department: 'San Salvador',
        city: 'San Salvador',
        addressLine: 'Blvd. Constitución, local 10',
        addressReference: 'Frente a centro comercial',
        notes: 'Cliente estratégico, tiempo en mercado 10 años.',
        isActive: true,
    },
    {
        code: 'CLI-002',
        name: 'Distribuidora Pacífico',
        taxId: '0614-150208-101-4',
        contactName: 'Roberto Herrera',
        contactEmail: 'roberto@distribuidorapacifico.com',
        contactPhone: '+503 7111-2233',
        country: 'El Salvador',
        department: 'La Libertad',
        city: 'Santa Tecla',
        addressLine: 'Km 12.5 Carretera al Puerto',
        addressReference: '',
        notes: '',
        isActive: true,
    },
    {
        code: 'CLI-003',
        name: 'Industrias Alimentarias del Sur',
        taxId: '0614-310505-103-1',
        contactName: 'Carmen López',
        contactEmail: 'carmen.lopez@indalimenter.com',
        contactPhone: '+503 7222-4455',
        country: 'El Salvador',
        department: 'Usulután',
        city: 'Usulután',
        addressLine: 'Calle Principal, Colonia Las Flores',
        addressReference: 'A 200m del parque central',
        notes: 'Requiere entregas los lunes y miércoles.',
        isActive: true,
    },
    {
        code: 'CLI-004',
        name: 'Farmacéutica Nacional S.A.',
        taxId: '0614-010190-104-2',
        contactName: 'Dr. Luis Méndez',
        contactEmail: 'l.mendez@farmanacional.com',
        contactPhone: '+503 7333-5566',
        country: 'El Salvador',
        department: 'San Salvador',
        city: 'San Salvador',
        addressLine: 'Av. Olímpica, Torre Médica, piso 3',
        addressReference: 'Edificio de cristal frente al hospital',
        notes: 'Requiere certificado de calidad en cada pedido.',
        isActive: true,
    },
    {
        code: 'CLI-005',
        name: 'Textiles Modernos',
        taxId: null,
        contactName: 'Ana García',
        contactEmail: 'ana@textilesmodernos.com',
        contactPhone: '+503 7444-6677',
        country: 'El Salvador',
        department: 'San Miguel',
        city: 'San Miguel',
        addressLine: 'Zona Industrial, Bodega 14',
        addressReference: '',
        notes: '',
        isActive: true,
    },
]

async function run() {
    for (const c of clients) {
        await prisma.client.upsert({
            where: { code: c.code },
            create: c,
            update: c,
        })
        console.log(`  → ${c.name} (${c.code})`)
    }
    console.log('✓ Clientes sembrados')
}

run()
    .then(async () => {
        await prisma.$disconnect()
        await pool.end()
        console.log('\nSeed de clientes completado.')
    })
    .catch(async (err) => {
        await prisma.$disconnect()
        await pool.end()
        console.error('Error en seed:', err)
        process.exit(1)
    })
