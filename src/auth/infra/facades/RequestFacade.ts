import { type User as UserDTO } from '@/auth/infra/facades/dtos/User.dto'
import { UserFacade } from '@/auth/infra/facades/User'

export class RequestFacade {
  protected user: UserFacade

  constructor () {
    this.user = new UserFacade()
  }

  public setUser (user: UserDTO): void {
    this.user.setUser(user)
  }

  public getUser (): UserDTO | undefined {
    return this.user.getUser()
  }
}
