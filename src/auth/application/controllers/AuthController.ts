import { type LogIn } from '@/auth/application/usecases/LogIn'
import { type SignIn } from '@/auth/application/usecases/SignIn'
import { type LogInInput } from '@/auth/infra/schemas/LogInSchema'
import { type SignInInput } from '@/auth/infra/schemas/SignInSchema'
import { type HttpServer } from '@api/domain/http/HttpServer'
import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { type InputValidate } from '@api/domain/validate/InputValidate'
import { inject } from '@api/infra/dependency-injection/Registry'

export class AuthController {
  @inject('httpServer')
  private readonly httpServer!: HttpServer

  @inject('signInValidate')
  private readonly signInValidate!: InputValidate<SignInInput>

  @inject('signIn')
  private readonly signIn!: SignIn

  @inject('logInValidate')
  private readonly logInValidate!: InputValidate<LogInInput>

  @inject('logIn')
  private readonly logIn!: LogIn

  constructor () {
    this.httpServer.register('post', '/sign_in', async (params: SignInInput) => {
      const inputParsed = this.signInValidate.validate(params)
      return await this.signIn.execute(inputParsed)
    }, HttpStatusCodes.OK)

    this.httpServer.register('post', '/login', async (params: LogInInput) => {
      const inputParsed = this.logInValidate.validate(params)
      return await this.logIn.execute(inputParsed)
    }, HttpStatusCodes.OK)
  }
}
