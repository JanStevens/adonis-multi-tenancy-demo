import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/tenant/user'
import { TenantService } from '#services/tenant_service'

export default class UsersController {
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const users = await User.query().preload('country').paginate(page, limit)

    await User.query().preload('country').paginate(page, limit)
    await User.query().preload('country').paginate(page, limit)
    await User.query().preload('country').paginate(page, limit)
    await User.query().preload('country').paginate(page, limit)
    await User.query().preload('country').paginate(page, limit)
    await User.query().preload('country').paginate(page, limit)

    Promise.all([
      User.query().preload('country').paginate(page, limit),
      User.query().preload('country').paginate(page, limit),
      User.query().preload('country').paginate(page, limit),
      User.query().preload('country').paginate(page, limit),
      User.query().preload('country').paginate(page, limit),
      User.query().preload('country').paginate(page, limit),
      User.query().preload('country').paginate(page, limit),
      User.query().preload('country').paginate(page, limit),
    ])

    return {
      searchPath: await TenantService.searchPath(),
      users,
    }
  }
}
