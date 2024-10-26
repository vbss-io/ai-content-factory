import { type SignInInput, type SignInOutput } from '@/auth/application/usecases/dtos/SignIn.dto'
import { type PasswordAuthentication } from '@/auth/domain/auth/PasswordAuthentication'
import { type TokenAuthentication } from '@/auth/infra/auth/JWTAdapter'
import { DifferentPasswordAndConfirmation } from '@/auth/infra/errors/AuthErrorCatalog'
import { User } from '@/user/domain/entities/User'
import { type UserRepository } from '@/user/domain/repositories/UserRepository'
import { UserAlreadyExist } from '@/user/infra/errors/UserErrorCatalog'
import { inject } from '@api/infra/dependency-injection/Registry'

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
