import { z } from 'zod'
import { type UserRepository, type ISeachByKm } from '../user.repository'

export const getMany = async (repository: UserRepository, limit?: number, searchByKm?: ISeachByKm) => {
  if (searchByKm) {
    const schema = z.object({
      km: z.number().min(1).optional(),
      latitude: z.number(),
      longitude: z.number()
    })

    const search = schema.parse(searchByKm)
    return await repository.getMany(limit, search)
  }
  return await repository.getMany(limit)
}
