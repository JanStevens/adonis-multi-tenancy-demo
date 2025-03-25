import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'
import Tenant from '#models/backoffice/tenant'
import { TenantService } from '#services/tenant_service'

export default class RunTenantMigrations extends BaseCommand {
  static readonly commandName = 'tenant:seed'

  static readonly description = 'Seed the tenant schema'

  static readonly options: CommandOptions = {
    startApp: true,
  }

  @flags.array({
    alias: 't',
    flagName: 'tenant',
    required: false,
    description: 'Tenant(s) id(s) to seed. If not provided, all tenants will be seeded',
  })
  declare tenantsIds?: string[]

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
      await this.seedTenant(tenant)
    }
  }

  private async seedTenant(tenant: Tenant) {
    const tasks = this.ui.tasks({ verbose: this.verbose })

    await tasks
      .add(`Migrating tenant "${tenant.name}": schema (${tenant.schemaName})`, async (task) => {
        try {
          task.update('Switching to the tenant database')
          await TenantService.switchSchema(tenant)

          const { SeedsRunner } = await import('@adonisjs/lucid/seeders')
          const seeder = new SeedsRunner(db, this.app, 'tenant')

          task.update('Running seeders')
          const seederFiles = await seeder.getList()

          for (const file of seederFiles) {
            const response = await seeder.run(file)

            if (response.status === 'failed') {
              return this.verbose
                ? task.error(`${file.name}: ${response.error.message}`)
                : task.error(`${file.name}: failed`)
            }
          }

          return 'completed'
        } catch (error) {
          return this.verbose ? task.error(error.message) : task.error('failed')
        }
      })
      .run()
  }
}
