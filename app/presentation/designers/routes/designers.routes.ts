import type { RouteRecordRaw } from 'vue-router'

export const designersRoutes: RouteRecordRaw[] = [
    {
        name: 'disenadores',
        path: '/disenadores',
        component: () => import('~/presentation/designers/view/DisenadoresView.vue'),
        meta: { allowedRoles: ['admin'] },
    },
]
