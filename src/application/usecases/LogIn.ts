import { type LogInInput, type LogInOutput } from '@/application/usecases/dto/LogIn.dto'
import { type UserRepository } from '@/domain/repository/UserRepository'
import { type PasswordAuthentication } from '@/infra/auth/PasswordAuthentication'
import { type TokenAuthentication } from '@/infra/auth/TokenAuthentication'
import { inject } from '@/infra/dependency-injection/Registry'
import { UserAuthenticationError } from '@/infra/error/ErrorCatalog'

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
    return { token }
  }
}
