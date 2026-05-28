import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.SUPABASE_DB_URL

if (!connectionString) {
    throw new Error('SUPABASE_DB_URL is required to initialize Prisma Client.')
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
    prismaPgPool: Pool | undefined
}

const pool = globalForPrisma.prismaPgPool ?? new Pool({ connectionString })
const adapter = new PrismaPg(pool)

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

globalForPrisma.prisma = prisma
globalForPrisma.prismaPgPool = pool
