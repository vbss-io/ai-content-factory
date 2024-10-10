import { type User } from '@/domain/entities/User'

export interface UserRepository {
  create: (user: User) => Promise<User>
  update: (user: User) => Promise<void>
  deleteById: (id: string) => Promise<void>
  getUserByUsername: (username: string) => Promise<User | undefined>
}
