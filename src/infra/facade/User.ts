import { type User as UserDto } from '@/infra/facade/dto/User.dto'

export class UserFacade {
  private user: UserDto | undefined

  constructor () {
    this.user = undefined
  }

  setUser ({ id, username, role }: UserDto): void {
    this.user = { id, username, role }
  }

  getUser (): UserDto | undefined {
    return this.user
  }
}
