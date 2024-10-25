import { type User as UserDTO } from '@/infra/facade/dto/User.dto'
import { UserFacade } from '@/infra/facade/User'

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
