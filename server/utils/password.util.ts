import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt) as (
    password: string,
    salt: Buffer,
    keyLength: number,
) => Promise<Buffer>

const HASH_SCHEME = 'scrypt'
const KEY_LENGTH = 64
const SALT_LENGTH = 16

const passwordCharset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'

const generateRandomSegment = (segmentLength: number) => {
    return Array.from({ length: segmentLength })
        .map(() => {
            const randomIndex = Math.floor(Math.random() * passwordCharset.length)
            return passwordCharset[randomIndex]
        })
        .join('')
}

export const generateTemporaryPassword = () => {
    const prefix = 'Tmp'
    const numericSegment = String(Math.floor(1000 + Math.random() * 9000))
    const alphaNumericSegment = generateRandomSegment(4)

    return `${prefix}-${numericSegment}${alphaNumericSegment}`
}

export const hashPassword = async (plainPassword: string): Promise<string> => {
    const salt = randomBytes(SALT_LENGTH)
    const derivedKey = await scryptAsync(plainPassword, salt, KEY_LENGTH)

    return `${HASH_SCHEME}$${salt.toString('base64')}$${derivedKey.toString('base64')}`
}

export const verifyPassword = async (
    plainPassword: string,
    storedHash: string,
): Promise<boolean> => {
    const segments = storedHash.split('$')

    if (segments.length !== 3 || segments[0] !== HASH_SCHEME) {
        return false
    }

    const salt = Buffer.from(segments[1]!, 'base64')
    const expectedKey = Buffer.from(segments[2]!, 'base64')

    if (expectedKey.length !== KEY_LENGTH) {
        return false
    }

    const candidateKey = await scryptAsync(plainPassword, salt, KEY_LENGTH)

    if (candidateKey.length !== expectedKey.length) {
        return false
    }

    return timingSafeEqual(candidateKey, expectedKey)
}
