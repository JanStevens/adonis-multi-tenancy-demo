import db from '@adonisjs/lucid/services/db'
import type Tenant from '#models/backoffice/tenant'
import type { MigratorOptions } from '@adonisjs/lucid/types/migrator'
import { MigrationRunner } from '@adonisjs/lucid/migration'
import app from '@adonisjs/core/services/app'
import multitenancy from '#config/multitenancy'

export class TenantService {
  static async createSchema(tenant: Tenant) {
    await db
      .connection(multitenancy.tenant.connectionName)
      .rawQuery(`CREATE SCHEMA "${tenant.schemaName}"`)
  }

  static async dropSchema(tenant: Tenant) {
    await db
      .connection(multitenancy.tenant.connectionName)
      .rawQuery(`DROP SCHEMA IF EXISTS "${tenant.schemaName}" CASCADE`)
  }

  static async switchSchema(tenant: Tenant) {
    return await db
      .connection(multitenancy.tenant.connectionName)
      .rawQuery(`SET search_path = "${tenant.schemaName}"`)
  }

  static async searchPath() {
    const searchPath = await db.rawQuery('SHOW search_path')
    return searchPath.rows[0].search_path.replaceAll('"', '')
  }

  static async runTenantMigrations(
    tenant: Tenant,
    options: Omit<MigratorOptions, 'connectionName'>
  ) {
    await this.switchSchema(tenant)

    const migrator = new MigrationRunner(db, app, {
      ...options,
      connectionName: multitenancy.tenant.connectionName,
    })

    await migrator.run()

    if (migrator.error) {
      throw migrator.error
    }

    return migrator
  }
}
