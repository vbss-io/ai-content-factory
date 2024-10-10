export interface UserCreate {
  username: string
  hash: string
  role: string
}

export type UserRestore = UserCreate & {
  id: string
  createdAt: Date
  updatedAt: Date
}
