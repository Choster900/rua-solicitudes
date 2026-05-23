import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  routes: () => [
    {
      name: 'index',
      path: '/',
      alias: ['/login'],
      component: () => import('~/presentation/auth/view/index.vue'),
    },
    {
      name: 'landing',
      path: '/landing',
      component: () => import('~/presentation/landing/view/index.vue'),
    },
  ],
}
