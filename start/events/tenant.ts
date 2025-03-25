import emitter from '@adonisjs/core/services/emitter'
import multitenancyConfig from '#config/multitenancy'
import { HttpContext } from '@adonisjs/core/http'

import PG from 'pg'

emitter.on('db:connection:connect', (conn) => {
  // We only care about tenant connection, we keep individual connections
  // for the public and backoffice
  if (conn.name !== 'tenant') return
  conn?.client?.once('start', (db) => {
    db.client.pool.on('acquireSuccess', async (_: number, c: PG.Client) => {
      const ctx = HttpContext.get()
      // Only bother switching if we are in the context of a request
      if (!ctx) {
        return
      }
      const header = ctx?.request?.header(multitenancyConfig.tenantHeaderKey)
      if (header) {
        await c.query(`SET search_path = "${multitenancyConfig.tenant.schemaPrefix}${header}"`)
        return
      } else if (ctx?.request) {
        await c.query(`SET search_path = "tenant__tenantId"`)
      }
    })
  })
})
