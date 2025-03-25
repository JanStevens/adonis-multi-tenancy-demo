import { Job } from '#services/queue'
import Tenant from '#models/backoffice/tenant'
import { TenantService } from '#services/tenant_service'

interface InstallTenantPayload {
  tenantId: string
}

export default class InstallTenant extends Job {
  static get $$filepath() {
    return import.meta.url
  }

  async handle(payload: InstallTenantPayload): Promise<void> {
    const tenant = await Tenant.findOrFail(payload.tenantId)

    await TenantService.createSchema(tenant)
    await TenantService.switchSchema(tenant)
    await TenantService.runTenantMigrations(tenant, { direction: 'up' })
  }

  async rescue(payload: InstallTenantPayload): Promise<void> {
    console.log(`Failed to install tenant ${payload.tenantId}`)
  }
}
