import { type UserCreate, type UserRestore } from './dto/User.dto'

export class User {
  id: string
  hash: string

  private constructor (
    id: string,
    readonly username: string,
    hash: string,
    readonly role: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.id = id
    this.hash = hash
  }

  static create (input: UserCreate): User {
    return new User(
      '',
      input.username,
      input.hash,
      input.role
    )
  }

  static restore (input: UserRestore): User {
    return new User(
      input.id,
      input.username,
      input.hash,
      input.role,
      input.createdAt,
      input.updatedAt
    )
  }

  updateHash (hash: string): void {
    this.hash = hash
  }
}
