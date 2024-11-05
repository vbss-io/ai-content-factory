import { User } from '@/user/domain/entities/User'
import { type UserRepository } from '@/user/domain/repositories/UserRepository'
import { type UserDocument, UserModel } from '@/user/infra/mongoose/UserModel'

export class UserRepositoryMongo implements UserRepository {
  async create (user: User): Promise<User> {
    const userDoc = new UserModel({
      username: user.username,
      hash: user.hash,
      role: user.role
    })
    const savedDoc = await userDoc.save()
    return this.toDomain(savedDoc)
  }

  async update (user: User): Promise<void> {
    const { id, ...rest } = user
    await UserModel.findByIdAndUpdate(id, { ...rest }, { new: true }).exec()
  }

  async deleteById (id: string): Promise<void> {
    await UserModel.findOneAndDelete({ _id: id })
  }

  async getUserByUsername (username: string): Promise<User | undefined> {
    const userDoc = await UserModel.findOne({ username })
    if (!userDoc) return
    return this.toDomain(userDoc)
  }

  async getUserByUserId (userId: string): Promise<User | undefined> {
    const userDoc = await UserModel.findById(userId)
    if (!userDoc) return
    return this.toDomain(userDoc)
  }

  private toDomain (userDoc: UserDocument): User {
    const id = userDoc._id as any
    return User.restore({
      id: id.toString(),
      username: userDoc.username,
      hash: userDoc.hash,
      imageLikes: userDoc.imageLikes,
      videoLikes: userDoc.videoLikes,
      role: userDoc.role,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt
    })
  }
}
