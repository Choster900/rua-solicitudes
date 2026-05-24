import type { RouterConfig } from '@nuxt/schema'
import { authRoutes } from '~/presentation/auth/routes/auth.routes'
import { clientsRoutes } from '~/presentation/clients/routes/clients.routes'
import { dashboardRoutes } from '~/presentation/dashboard/routes/dashboard.routes'
import { designersRoutes } from '~/presentation/designers/routes/designers.routes'
import { landingRoutes } from '~/presentation/landing/routes/landing.routes'
import { qualityRoutes } from '~/presentation/quality/routes/quality.routes'
import { vendorsRoutes } from '~/presentation/vendors/routes/vendors.routes'

export default <RouterConfig>{
  routes: () => [
    ...authRoutes,
    ...landingRoutes,
    ...dashboardRoutes,
    ...clientsRoutes,
    ...designersRoutes,
    ...qualityRoutes,
    ...vendorsRoutes,
  ],
}
