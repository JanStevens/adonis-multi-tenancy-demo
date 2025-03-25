import multitenancyConfig from '#config/multitenancy'
import { Adapter } from '@adonisjs/lucid/orm'
import type { LucidModel, ModelAdapterOptions } from '@adonisjs/lucid/types/model'

/**
 * This will scope the model connection and queries to the backoffice
 */
export default class BackofficeAdapter extends Adapter {
  override query(modelConstructor: LucidModel, options?: ModelAdapterOptions): any {
    const client = this.modelConstructorClient(modelConstructor, options)
    return client.modelQuery(modelConstructor).withSchema(multitenancyConfig.backoffice.schemaName)
  }
}
