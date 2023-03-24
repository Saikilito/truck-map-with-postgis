import { type UserRepository } from '../user.repository'

export const getByUserId = async (repository: UserRepository, userId: number) => {
  return await repository.getById(userId)
}
