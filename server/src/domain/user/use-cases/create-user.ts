import { z } from 'zod'
import { type UserInput } from '../user.entity'
import { type UserRepository } from '../user.repository'

export const createUser = async (repository: UserRepository, input: UserInput) => {
  const userSchema = z.object({
    username: z.string().min(4),
    latitude: z.number(),
    longitude: z.number()
  })

  userSchema.parse(input)

  await repository.create(input)
}
