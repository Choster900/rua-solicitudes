import type { RouteRecordRaw } from 'vue-router'

export const requestWorkflowRoutes: RouteRecordRaw[] = [
  {
    name: 'request.design.view',
    path: '/requests/design',
    component: () => import('~/presentation/request-workflow/view/DesignQueueView.vue'),
  },
  {
    name: 'request.quality.view',
    path: '/requests/quality',
    component: () => import('~/presentation/request-workflow/view/QualityQueueView.vue'),
  },
  {
    name: 'request.workflow.detail',
    path: '/requests/workflow/:requestId',
    component: () => import('~/presentation/request-workflow/view/RequestWorkflowDetailView.vue'),
  },
  {
    name: 'request.workflow.legacy.index',
    path: '/requests',
    redirect: '/requests/design',
  },
  {
    name: 'request.workflow.legacy.tracking',
    path: '/requests/tracking',
    redirect: '/requests/design',
  },
]
