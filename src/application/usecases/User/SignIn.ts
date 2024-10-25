import { type SignInInput, type SignInOutput } from '@/application/usecases/User/dtos/SignIn.dto'
import { type PasswordAuthentication } from '@/domain/auth/PasswordAuthentication'
import { User } from '@/domain/entities/User'
import { type UserRepository } from '@/domain/repositories/UserRepository'
import { type TokenAuthentication } from '@/infra/auth/JWTAdapter'
import { inject } from '@api/infra/dependency-injection/Registry'
import { DifferentPasswordAndConfirmation, UserAlreadyExist } from '@api/infra/errors/ErrorCatalog'

export class SignIn {
  @inject('userRepository')
  private readonly userRepository!: UserRepository

  @inject('passwordAuthentication')
  private readonly passwordAuthentication!: PasswordAuthentication

  @inject('tokenAuthentication')
  private readonly tokenAuthentication!: TokenAuthentication

  async execute ({ username, password, confirmPassword }: SignInInput): Promise<SignInOutput> {
    if (password !== confirmPassword) throw new DifferentPasswordAndConfirmation()
    const existingUser = await this.userRepository.getUserByUsername(username)
    if (existingUser) throw new UserAlreadyExist()
    const hash = await this.passwordAuthentication.hash(password)
    const user = User.create({ username, hash, role: 'user' })
    const createdUser = await this.userRepository.create(user)
    const token = this.tokenAuthentication.encode({ id: createdUser.id, username: createdUser.username, role: createdUser.role }, process.env.SECRET_KEY as string)
    return {
      token,
      username: user.username,
      role: user.role
    }
  }
}
