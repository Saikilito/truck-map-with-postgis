import { type UserRepository } from '../user.repository'

export const deleteByUserId = async (repository: UserRepository, userId: number) => {
  await repository.deleteById(userId)
}
