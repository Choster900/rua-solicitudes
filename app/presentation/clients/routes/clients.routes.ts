import type { RouteRecordRaw } from 'vue-router'

export const clientsRoutes: RouteRecordRaw[] = [
  {
    name: 'clientes',
    path: '/clientes',
    component: () => import('~/presentation/clients/view/ClientesView.vue'),
  },
]
