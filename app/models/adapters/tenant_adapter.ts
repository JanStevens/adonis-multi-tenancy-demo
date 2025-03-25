import { Adapter } from '@adonisjs/lucid/orm'

/**
 * This will scope the model to the current tenant
 */
export default class TenantAdapter extends Adapter {}
