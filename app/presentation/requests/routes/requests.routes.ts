import type { RouteRecordRaw } from 'vue-router'

export const requestsRoutes: RouteRecordRaw[] = [
  {
    name: 'solicitudes',
    path: '/solicitudes',
    component: () => import('~/presentation/requests/view/SolicitudesView.vue'),
  },
  {
    name: 'solicitudes-nueva',
    path: '/solicitudes/nueva',
    component: () => import('~/presentation/requests/view/SolicitudCreateView.vue'),
  },
  {
    name: 'solicitudes-editar',
    path: '/solicitudes/:id/editar',
    component: () => import('~/presentation/requests/view/SolicitudEditView.vue'),
  },
]
