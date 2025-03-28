import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Tenant from '#models/backoffice/tenant'
import { TenantService } from '#services/tenant_service'

export default class RunTenantMigrations extends BaseCommand {
  static readonly commandName = 'migration:tenant:run'

  static readonly description = 'Migrate the tenant schema'

  static readonly options: CommandOptions = {
    startApp: true,
  }

  @flags.array({
    alias: 't',
    flagName: 'tenant',
    required: false,
    description: 'Tenant(s) id(s) to migrate. If not provided, all tenants will be migrated',
  })
  declare tenantsIds?: string[]

  @flags.boolean({
    default: false,
    flagName: 'dry-run',
    description: 'Do not run actual queries. Instead view the SQL output',
  })
  declare dryRun: boolean

  @flags.boolean({
    default: false,
    flagName: 'disable-locks',
    description: 'Disable locks acquired to run migrations safely',
  })
  declare disableLocks: boolean

  @flags.boolean({
    default: false,
    flagName: 'verbose',
  })
  declare verbose: boolean

  async run() {
    const tenants =
      this.tenantsIds && this.tenantsIds.length > 0
        ? await Tenant.query().whereIn('id', this.tenantsIds)
        : await Tenant.all()

    for (const tenant of tenants) {
      await this.migrateTenant(tenant)
    }
  }

  private async migrateTenant(tenant: Tenant) {
    const tasks = this.ui.tasks({ verbose: this.verbose })

    await tasks
      .add(`Migrating tenant "${tenant.name}": schema (${tenant.schemaName})`, async (task) => {
        try {
          task.update('Running migrations')
          await TenantService.runTenantMigrations(tenant, {
            direction: 'up',
            disableLocks: this.disableLocks,
            dryRun: this.dryRun,
          })

          return 'completed'
        } catch (error) {
          return this.verbose ? task.error(error.message) : task.error('failed')
        }
      })
      .run()
  }
}
