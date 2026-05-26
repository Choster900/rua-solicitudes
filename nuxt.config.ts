import { validateEnv } from './config/env'

const env = validateEnv()

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/eslint'],
    devtools: { enabled: true },
    app: {
        head: {
            title: env.NUXT_PUBLIC_APP_NAME,
            link: [
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Inclusive+Sans:ital,wght@0,400;1,400&family=JetBrains+Mono:wght@500&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
                },
            ],
            script: [
                {
                    key: 'theme-mode-init',
                    tagPriority: 'critical',
                    innerHTML: `(function(){try{var stored=localStorage.getItem('app-theme-mode');var mode=(stored==='light'||stored==='dark')?stored:'dark';var root=document.documentElement;root.classList.toggle('dark',mode==='dark');root.classList.toggle('light',mode==='light');}catch(e){}})();`,
                },
            ],
        },
    },
    css: [
        '~/assets/styles/base/globals.css',
        '~/assets/styles/themes/light/theme.css',
        '~/assets/styles/themes/dark/theme.css',
        'vue-sonner/style.css',
        '@vuepic/vue-datepicker/dist/main.css',
        '~/assets/styles/tailwind/main.css',
    ],
    runtimeConfig: {
        databaseUrl: env.SUPABASE_DB_URL,
        directUrl: env.SUPABASE_DB_URL,
        authJwtSecret: env.AUTH_JWT_SECRET,
        authAccessTokenExpiresInSeconds: env.AUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
        supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
        public: {
            appName: env.NUXT_PUBLIC_APP_NAME,
            appUrl: env.NUXT_PUBLIC_APP_URL,
            apiUrl: env.NUXT_PUBLIC_API_URL,
            supabaseUrl: env.SUPABASE_URL,
            supabaseAnonKey: env.SUPABASE_ANON_KEY,
        },
    },
    alias: {
        '@presentation': '/app/presentation',
        '@shared': '/app/shared',
        '@interfaces': '/app/shared/interfaces',
        '@types': '/app/types',
        '@utils': '/app/utils',
        '@constants': '/app/constants',
        '@services': '/app/services',
    },
    devServer: {
        host: '0.0.0.0',
        port: env.PORT,
    },
    compatibilityDate: '2025-07-15',
    tailwindcss: {
        configPath: 'tailwind.config.ts',
    },
})
