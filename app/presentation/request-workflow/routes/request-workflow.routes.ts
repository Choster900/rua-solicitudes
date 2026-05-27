import type { RouteRecordRaw } from 'vue-router'

const DESIGN_ROLES = ['admin', 'disenador_jefe', 'disenador']
const QUALITY_ROLES = ['admin', 'calidad']
const WORKFLOW_ROLES = ['admin', 'calidad']

export const requestWorkflowRoutes: RouteRecordRaw[] = [
    {
        name: 'request.design.view',
        path: '/requests/design',
        component: () => import('~/presentation/request-workflow/view/DesignQueueView.vue'),
        meta: { allowedRoles: DESIGN_ROLES },
    },
    {
        name: 'request.quality.view',
        path: '/requests/quality',
        component: () => import('~/presentation/request-workflow/view/QualityQueueView.vue'),
        meta: { allowedRoles: QUALITY_ROLES },
    },
    {
        name: 'request.workflow.detail',
        path: '/requests/workflow/:requestId',
        component: () =>
            import('~/presentation/request-workflow/view/RequestWorkflowDetailView.vue'),
        meta: { allowedRoles: WORKFLOW_ROLES },
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
