import { z } from 'zod'
import { type UserInput } from '../user.entity'
import { type UserRepository } from '../user.repository'

export const updateUser = async (repository: UserRepository, userId: number, data: Partial<UserInput>) => {
  const schema = z.object({
    username: z.string().min(4).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    createdAt: z.number().optional(),
    deleteAt: z.number().optional()
  })

  const userData = schema.parse(data)

  await repository.update(userId, userData)
}
