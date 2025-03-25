import Country from '#models/central/country'
import type { HttpContext } from '@adonisjs/core/http'

export default class CountriesController {
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 25)

    return Country.query().orderBy('iso').paginate(page, limit)
  }
}
