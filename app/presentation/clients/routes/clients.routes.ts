import type { RouteRecordRaw } from 'vue-router'

export const clientsRoutes: RouteRecordRaw[] = [
  {
    name: 'clientes',
    path: '/clientes',
    component: () => import('~/presentation/clients/view/ClientesView.vue'),
  },
  {
    name: 'clientes-nuevo',
    path: '/clientes/nuevo',
    component: () => import('~/presentation/clients/view/ClienteCreateView.vue'),
  },
  {
    name: 'clientes-editar',
    path: '/clientes/:id/editar',
    component: () => import('~/presentation/clients/view/ClienteEditView.vue'),
  },
]
