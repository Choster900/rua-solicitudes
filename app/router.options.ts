import type { RouterConfig } from '@nuxt/schema'
import { authRoutes } from '~/presentation/auth/routes/auth.routes'
import { clientsRoutes } from '~/presentation/clients/routes/clients.routes'
import { dashboardRoutes } from '~/presentation/dashboard/routes/dashboard.routes'
import { designersRoutes } from '~/presentation/designers/routes/designers.routes'
import { landingRoutes } from '~/presentation/landing/routes/landing.routes'
import { qualityRoutes } from '~/presentation/quality/routes/quality.routes'
import { requestWorkflowRoutes } from '~/presentation/request-workflow/routes/request-workflow.routes'
import { requestsRoutes } from '~/presentation/requests/routes/requests.routes'
import { usersRoutes } from '~/presentation/users/routes/users.routes'
import { vendorsRoutes } from '~/presentation/vendors/routes/vendors.routes'

export default <RouterConfig>{
  routes: () => [
    ...authRoutes,
    ...landingRoutes,
    ...dashboardRoutes,
    ...requestWorkflowRoutes,
    ...requestsRoutes,
    ...clientsRoutes,
    ...designersRoutes,
    ...qualityRoutes,
    ...vendorsRoutes,
    ...usersRoutes,
  ],
}
