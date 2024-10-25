import { type LogIn } from '@/application/usecases/User/LogIn'
import { type SignIn } from '@/application/usecases/User/SignIn'
import { type HttpServer } from '@/domain/http/HttpServer'
import { HttpStatusCodes } from '@/domain/http/HttpStatusCodes'
import { type InputValidate } from '@/domain/validate/InputValidate'
import { inject } from '@/infra/dependency-injection/Registry'
import { type LogInInput } from '@/infra/schemas/LogInSchema'
import { type SignInInput } from '@/infra/schemas/SignInSchema'

export class UserController {
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
