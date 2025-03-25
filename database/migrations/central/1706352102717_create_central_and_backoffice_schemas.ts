import multitenancyConfig from '#config/multitenancy'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createSchemaIfNotExists(multitenancyConfig.central.schemaName)
    this.schema.createSchemaIfNotExists(multitenancyConfig.backoffice.schemaName)
  }

  async down() {
    this.schema.dropSchemaIfExists(multitenancyConfig.central.schemaName)
    this.schema.dropSchemaIfExists(multitenancyConfig.backoffice.schemaName)
  }
}
