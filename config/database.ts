import multitenancyConfig from '#config/multitenancy'
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const defaultConnectionOptions = {
  client: 'pg',
  connection: {
    host: env.get('DB_HOST'),
    port: env.get('DB_PORT'),
    user: env.get('DB_USER'),
    password: env.get('DB_PASSWORD'),
    database: env.get('DB_DATABASE'),
    ssl: env.get('DB_SSL'),
  },
  debug: true,
  pool: {
    min: 0,
    max: 10,
  },
  useNullAsDefault: true,
} as const

const dbConfig = defineConfig({
  prettyPrintDebugQueries: true,
  connection: 'tenant',
  connections: {
    [multitenancyConfig.central.connectionName]: {
      ...defaultConnectionOptions,
      searchPath: [multitenancyConfig.central.schemaName],
      migrations: {
        naturalSort: true,
        paths: ['database/migrations/central'],
      },
      seeders: {
        paths: ['database/seeders/central'],
      },
    },

    [multitenancyConfig.backoffice.connectionName]: {
      ...defaultConnectionOptions,
      searchPath: [multitenancyConfig.backoffice.schemaName],
      migrations: {
        naturalSort: true,
        paths: ['database/migrations/backoffice'],
      },
      seeders: {
        paths: ['database/seeders/backoffice'],
      },
    },

    tenant: {
      ...defaultConnectionOptions,
      // Ensures the defaults to an invalid schema
      searchPath: [`${multitenancyConfig.tenant.schemaPrefix}_tenantId`],
      migrations: {
        naturalSort: true,
        paths: ['database/migrations/tenant'],
      },
      seeders: {
        paths: ['database/seeders/tenant'],
      },
      pool: {
        min: 10,
        max: 100,
      },
    },
  },
})

export default dbConfig
