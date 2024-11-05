import { type User } from '@/user/domain/entities/User'

export interface UserRepository {
  create: (user: User) => Promise<User>
  getUserByUsername: (username: string) => Promise<User | undefined>
  getUserByUserId: (userId: string) => Promise<User | undefined>
  update: (user: User) => Promise<void>
  deleteById: (id: string) => Promise<void>
}
