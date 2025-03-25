import { TenantService } from '#services/tenant_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class TenantGuardMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    // This will throw an exception if the tenant header is missing
    // or the tenant does not exists
    // See: extensions/request.ts for more details
    await request.tenant()

    // Run the other middlewars
    await next()

    // Fun fact, we only switch the tenant schema once we actually perform a request
    response.safeHeader('tenant', await TenantService.searchPath())
  }
}
