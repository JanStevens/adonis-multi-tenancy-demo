import env from '#start/env'

export default {
  backoffice: {
    schemaName: 'backoffice',
    connectionName: 'backoffice',
  },
  central: {
    schemaName: 'public',
    connectionName: 'public',
  },
  tenant: {
    schemaPrefix: 'tenant_',
    connectionName: 'tenant',
  },
  tenantHeaderKey: env.get('TENANT_HEADER_KEY'),
}
