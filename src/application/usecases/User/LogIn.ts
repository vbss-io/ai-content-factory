import { type LogInInput, type LogInOutput } from '@/application/usecases/User/dtos/LogIn.dto'
import { type PasswordAuthentication } from '@/domain/auth/PasswordAuthentication'
import { type UserRepository } from '@/domain/repositories/UserRepository'
import { type TokenAuthentication } from '@/infra/auth/JWTAdapter'
import { inject } from '@api/infra/dependency-injection/Registry'
import { UserAuthenticationError } from '@api/infra/errors/ErrorCatalog'

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
