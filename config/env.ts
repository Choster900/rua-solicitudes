import Joi from 'joi'

export interface AppEnv {
    DATABASE_URL: string
    DIRECT_URL: string
    SUPABASE_URL: string
    SUPABASE_ANON_KEY: string
    SUPABASE_SERVICE_ROLE_KEY: string
    PORT: number
    NUXT_PUBLIC_APP_NAME: string
    NUXT_PUBLIC_APP_URL: string
    NUXT_PUBLIC_API_URL: string
    NODE_ENV: 'development' | 'production' | 'test'
}

const envSchema = Joi.object<AppEnv>({
    DATABASE_URL: Joi.string()
        .uri({ scheme: ['postgres', 'postgresql'] })
        .required(),
    DIRECT_URL: Joi.string()
        .uri({ scheme: ['postgres', 'postgresql'] })
        .required(),
    SUPABASE_URL: Joi.string()
        .uri({ scheme: ['https'] })
        .required(),
    SUPABASE_ANON_KEY: Joi.string().min(10).required(),
    SUPABASE_SERVICE_ROLE_KEY: Joi.string().min(10).required(),
    PORT: Joi.number().integer().min(1).max(65535).default(3000),
    NUXT_PUBLIC_APP_NAME: Joi.string().min(1).required(),
    NUXT_PUBLIC_APP_URL: Joi.string()
        .trim()
        .uri({ scheme: ['http', 'https'] })
        .allow('')
        .optional(),
    NUXT_PUBLIC_API_URL: Joi.string()
        .trim()
        .uri({ scheme: ['http', 'https'] })
        .allow('')
        .optional(),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
}).unknown(true)

let validatedEnv: AppEnv | null = null

export function validateEnv(): AppEnv {
    if (validatedEnv) {
        return validatedEnv
    }

    const { error, value } = envSchema.validate(process.env, {
        abortEarly: false,
        convert: true,
    })

    if (error) {
        const details = error.details.map((detail) => `- ${detail.message}`).join('\n')
        throw new Error(`Environment validation failed:\n${details}`)
    }

    const resolvedAppUrl =
        String(value.NUXT_PUBLIC_APP_URL || '').trim() || `http://127.0.0.1:${value.PORT}`
    const resolvedApiUrl = String(value.NUXT_PUBLIC_API_URL || '').trim() || resolvedAppUrl

    validatedEnv = {
        ...value,
        NUXT_PUBLIC_APP_URL: resolvedAppUrl,
        NUXT_PUBLIC_API_URL: resolvedApiUrl,
    } as AppEnv

    return validatedEnv
}
