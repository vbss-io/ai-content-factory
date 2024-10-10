import { UserController } from '@/application/controllers/UserController'
import { LogIn } from '@/application/usecases/LogIn'
import { SignIn } from '@/application/usecases/SignIn'
import { BcryptAdapter } from '@/infra/auth/PasswordAuthentication'
import { Registry } from '@/infra/dependency-injection/Registry'
import { UserRepositoryMongo } from '@/infra/mongodb/repository/UserRepositoryMongo'
import { LogInSchema } from '@/infra/schemas/LogInSchema'
import { SignInSchema } from '@/infra/schemas/SignInSchema'
import { ZodAdapter } from '@/infra/validate/InputValidate'

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
