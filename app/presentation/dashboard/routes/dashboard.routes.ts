import type { RouteRecordRaw } from 'vue-router'

export const dashboardRoutes: RouteRecordRaw[] = [
    {
        name: 'dashboard',
        path: '/dashboard',
        component: () => import('~/presentation/dashboard/view/DashboardView.vue'),
        meta: { allowedRoles: ['admin'] },
    },
]
