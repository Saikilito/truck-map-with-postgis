import { type User, type UserInput } from './user.entity'

export interface ISeachByKm {
  km: number
  latitude: number
  longitude: number
}

export interface UserRepository {
  create: (input: UserInput) => Promise<void>
  getMany: (limit?: number, searchByKm?: ISeachByKm) => Promise<User[]>
  getById: (id: number) => Promise<User>
  deleteById: (id: number) => Promise<void>
  update: (id: number, data: Partial<UserInput>) => Promise<void>
}
