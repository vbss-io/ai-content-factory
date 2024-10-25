import { Registry } from '@/@api/infra/dependency-injection/Registry'
import { ZodAdapter } from '@/@api/infra/validate/ZodAdapter'
import { UserController } from '@/application/controllers/UserController'
import { LogIn } from '@/application/usecases/User/LogIn'
import { SignIn } from '@/application/usecases/User/SignIn'
import { BcryptAdapter } from '@/infra/auth/BcryptAdapter'
import { UserRepositoryMongo } from '@/infra/repositories/UserRepositoryMongo'
import { LogInSchema } from '@/infra/schemas/LogInSchema'
import { SignInSchema } from '@/infra/schemas/SignInSchema'

export class UserModule {
  constructor () {
    const passwordAuthentication = new BcryptAdapter()
    Registry.getInstance().provide('passwordAuthentication', passwordAuthentication)
    const signInValidate = new ZodAdapter(SignInSchema)
    const logInValidate = new ZodAdapter(LogInSchema)
    Registry.getInstance().provide('signInValidate', signInValidate)
    Registry.getInstance().provide('logInValidate', logInValidate)
    const userRepository = new UserRepositoryMongo()
    Registry.getInstance().provide('userRepository', userRepository)
    const signIn = new SignIn()
    const logIn = new LogIn()
    Registry.getInstance().provide('signIn', signIn)
    Registry.getInstance().provide('logIn', logIn)
    new UserController()
  }
}
