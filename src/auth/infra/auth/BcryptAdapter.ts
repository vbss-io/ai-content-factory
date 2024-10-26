import { type PasswordAuthentication } from '@/auth/domain/auth/PasswordAuthentication'
import bcrypt from 'bcryptjs'

export class BcryptAdapter implements PasswordAuthentication {
  async hash (password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }

  async compare (password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }
}
