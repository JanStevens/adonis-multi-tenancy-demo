import multitenancyConfig from '#config/multitenancy'
import { BaseModel, CamelCaseNamingStrategy } from '@adonisjs/lucid/orm'
import { LucidModel } from '@adonisjs/lucid/types/model'

// Needed to handle relationships with non central tables
class CentralNamingStrategy extends CamelCaseNamingStrategy {
  tableName(model: LucidModel): string {
    return `${multitenancyConfig.central.schemaName}.${super.tableName(model)}`
  }
}

export default class CentralBaseModel extends BaseModel {
  static readonly connection = multitenancyConfig.central.connectionName
  static readonly namingStrategy = new CentralNamingStrategy()
}
