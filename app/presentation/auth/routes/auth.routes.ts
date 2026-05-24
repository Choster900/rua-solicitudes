import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    name: 'index',
    path: '/',
    alias: ['/login'],
    component: () => import('~/presentation/auth/view/LoginView.vue'),
  },
]
