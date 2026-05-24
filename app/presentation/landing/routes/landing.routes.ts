import type { RouteRecordRaw } from 'vue-router'

export const landingRoutes: RouteRecordRaw[] = [
  {
    name: 'landing',
    path: '/landing',
    component: () => import('~/presentation/landing/view/index.vue'),
  },
]
