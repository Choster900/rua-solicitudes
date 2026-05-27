import type { RouteRecordRaw } from 'vue-router'

export const vendorsRoutes: RouteRecordRaw[] = [
    {
        name: 'vendedores',
        path: '/vendedores',
        component: () => import('~/presentation/vendors/view/VendedoresView.vue'),
        meta: { allowedRoles: ['admin'] },
    },
]
