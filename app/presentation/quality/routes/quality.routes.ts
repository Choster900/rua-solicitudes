import type { RouteRecordRaw } from 'vue-router'

export const qualityRoutes: RouteRecordRaw[] = [
    {
        name: 'calidad',
        path: '/calidad',
        component: () => import('~/presentation/quality/view/CalidadView.vue'),
        meta: { allowedRoles: ['admin', 'disenador_jefe', 'calidad'] },
    },
]
