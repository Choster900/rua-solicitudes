import type { RouteRecordRaw } from 'vue-router'

const CLIENTES_ROLES = ['admin', 'vendedor', 'calidad']

export const clientsRoutes: RouteRecordRaw[] = [
    {
        name: 'clientes',
        path: '/clientes',
        component: () => import('~/presentation/clients/view/ClientesView.vue'),
        meta: { allowedRoles: CLIENTES_ROLES },
    },
    {
        name: 'clientes-nuevo',
        path: '/clientes/nuevo',
        component: () => import('~/presentation/clients/view/ClienteCreateView.vue'),
        meta: { allowedRoles: CLIENTES_ROLES },
    },
    {
        name: 'clientes-editar',
        path: '/clientes/:id/editar',
        component: () => import('~/presentation/clients/view/ClienteEditView.vue'),
        meta: { allowedRoles: CLIENTES_ROLES },
    },
]
