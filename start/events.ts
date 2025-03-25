import '#listeners/backoffice/init'
import string from '@adonisjs/core/helpers/string'
import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'

emitter.on('http:request_completed', function ({ ctx, duration }) {
  logger.info(
    `[${ctx.response.getStatus()}] ${ctx.request.method()} ${ctx.request.url()} - ${string.prettyHrTime(duration)}`
  )
})
