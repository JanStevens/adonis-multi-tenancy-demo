import multitenancyConfig from '#config/multitenancy'
import BackofficeBaseModel from '#models/backoffice/backoffice_base_model'
import cache from '#services/cache'
import { column } from '@adonisjs/lucid/orm'

import { DateTime } from 'luxon'

export default class Tenant extends BackofficeBaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column({ prepare: (value: string) => value.toLowerCase() })
  declare email: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /** Returns the schema name of the tenant */
  get schemaName() {
    return `${multitenancyConfig.tenant.schemaPrefix}${this.id}`
  }

  /**
   * After deleting a tenant, normally you should call this method
   * for the cleanup
   */

  /** Resolve the tenant from the header */
  static async findFromHeader(header: string) {
    const tenant = await cache.namespace('tenants').getOrSet({
      key: `tenant:${header}`,
      factory: () => Tenant.query().where('id', header).firstOrFail(),
    })

    if (tenant) return new Tenant().merge(tenant)

    return null
  }
}
