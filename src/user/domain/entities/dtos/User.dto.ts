export interface UserCreate {
  username: string
  hash: string
  role: string
  avatar?: string
}

export type UserRestore = UserCreate & {
  id: string
  imageLikes: string[]
  videoLikes: string[]
  createdAt: Date
  updatedAt: Date
}
