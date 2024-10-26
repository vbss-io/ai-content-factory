import { AuthController } from '@/auth/application/controllers/AuthController'
import { LogIn } from '@/auth/application/usecases/LogIn'
import { SignIn } from '@/auth/application/usecases/SignIn'
import { BcryptAdapter } from '@/auth/infra/auth/BcryptAdapter'
import { JWTAdapter } from '@/auth/infra/auth/JWTAdapter'
import { RequestFacade } from '@/auth/infra/facades/RequestFacade'
import { LogInSchema } from '@/auth/infra/schemas/LogInSchema'
import { SignInSchema } from '@/auth/infra/schemas/SignInSchema'
import { UserRepositoryMongo } from '@/user/infra/repositories/UserRepositoryMongo'
import { Registry } from '@api/infra/dependency-injection/Registry'
import { ZodAdapter } from '@api/infra/validate/ZodAdapter'

export class AuthModule {
  constructor () {
    const tokenAuthentication = new JWTAdapter()
    const requestFacade = new RequestFacade()
    const passwordAuthentication = new BcryptAdapter()
    Registry.getInstance().provide('tokenAuthentication', tokenAuthentication)
    Registry.getInstance().provide('requestFacade', requestFacade)
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
    new AuthController()
  }
}
