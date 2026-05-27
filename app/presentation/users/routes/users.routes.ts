import type { RouteRecordRaw } from 'vue-router'

export const usersRoutes: RouteRecordRaw[] = [
    {
        name: 'usuarios',
        path: '/usuarios',
        component: () => import('~/presentation/users/view/UsuariosView.vue'),
        meta: { requiresRole: 'admin' },
    },
    {
        name: 'usuarios-nuevo',
        path: '/usuarios/nuevo',
        component: () => import('~/presentation/users/view/UsuarioCreateView.vue'),
        meta: { requiresRole: 'admin' },
    },
    {
        name: 'usuarios-editar',
        path: '/usuarios/:id/editar',
        component: () => import('~/presentation/users/view/UsuarioEditView.vue'),
        meta: { requiresRole: 'admin' },
    },
]
