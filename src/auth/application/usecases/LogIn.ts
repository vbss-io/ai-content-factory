import { type LogInInput, type LogInOutput } from '@/auth/application/usecases/dtos/LogIn.dto'
import { type PasswordAuthentication } from '@/auth/domain/auth/PasswordAuthentication'
import { type TokenAuthentication } from '@/auth/infra/auth/JWTAdapter'
import { UserAuthenticationError } from '@/auth/infra/errors/AuthErrorCatalog'
import { type UserRepository } from '@/user/domain/repositories/UserRepository'
import { inject } from '@api/infra/dependency-injection/Registry'

export class LogIn {
  @inject('userRepository')
  private readonly userRepository!: UserRepository

  @inject('passwordAuthentication')
  private readonly passwordAuthentication!: PasswordAuthentication

  @inject('tokenAuthentication')
  private readonly tokenAuthentication!: TokenAuthentication

  async execute ({ username, password }: LogInInput): Promise<LogInOutput> {
    const user = await this.userRepository.getUserByUsername(username)
    if (!user) throw new UserAuthenticationError()
    const passwordMatch = await this.passwordAuthentication.compare(password, user.hash)
    if (!passwordMatch) throw new UserAuthenticationError()
    const token = this.tokenAuthentication.encode({ id: user.id, username: user.username, role: user.role }, process.env.SECRET_KEY as string)
    return {
      token,
      username: user.username,
      role: user.role
    }
  }
}
