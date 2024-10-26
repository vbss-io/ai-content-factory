import { type UserCreate, type UserRestore } from '@/user/domain/entities/dtos/User.dto'

export class User {
  id: string
  hash: string
  imageLikes: string[]
  videoLikes: string[]

  private constructor (
    id: string,
    readonly username: string,
    hash: string,
    imageLikes: string[],
    videoLikes: string[],
    readonly role: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.id = id
    this.hash = hash
    this.imageLikes = imageLikes
    this.videoLikes = videoLikes
  }

  static create (input: UserCreate): User {
    return new User(
      '',
      input.username,
      input.hash,
      [],
      [],
      input.role
    )
  }

  static restore (input: UserRestore): User {
    return new User(
      input.id,
      input.username,
      input.hash,
      input.imageLikes,
      input.videoLikes,
      input.role,
      input.createdAt,
      input.updatedAt
    )
  }

  updateHash (hash: string): void {
    this.hash = hash
  }

  updateImageLikes (image: string): void {
    const alreadyLike = this.imageLikes.includes(image)
    if (!alreadyLike) this.imageLikes.push(image)
    if (alreadyLike) this.imageLikes = this.imageLikes.filter((imageLike) => imageLike !== image)
  }

  updateVideoLikes (video: string): void {
    const alreadyLike = this.videoLikes.includes(video)
    if (!alreadyLike) this.videoLikes.push(video)
    if (alreadyLike) this.videoLikes = this.videoLikes.filter((videoLike) => videoLike !== video)
  }
}
