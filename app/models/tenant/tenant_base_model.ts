import { BaseModel } from '@adonisjs/lucid/orm'
export default class TenantBaseModel extends BaseModel {
  static readonly connection = 'tenant'
}
