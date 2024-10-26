import { UserRepositoryMongo } from '@/user/infra/repositories/UserRepositoryMongo'
import { Registry } from '@api/infra/dependency-injection/Registry'

export class UserModule {
  constructor () {
    const userRepository = new UserRepositoryMongo()
    Registry.getInstance().provide('userRepository', userRepository)
  }
}
