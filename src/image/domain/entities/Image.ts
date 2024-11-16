import { type ImageCreate, type ImageRestore } from '@/image/domain/entities/dtos/Image.dto'

export class Image {
  id: string
  likes: number

  private constructor (
    id: string,
    readonly width: number,
    readonly height: number,
    readonly aspectRatio: string,
    readonly seed: number,
    readonly path: string,
    readonly batchId: string,
    likes: number,
    readonly authorName?: string,
    readonly authorAvatar?: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.id = id
    this.likes = likes
  }

  static create (input: ImageCreate): Image {
    return new Image(
      '',
      input.width,
      input.height,
      input.aspectRatio,
      input.seed,
      input.path,
      input.batchId,
      0
    )
  }

  static restore (input: ImageRestore): Image {
    return new Image(
      input.id,
      input.width,
      input.height,
      input.aspectRatio,
      input.seed,
      input.path,
      input.batchId,
      input.likes,
      input.authorName,
      input.authorAvatar,
      input.createdAt,
      input.updatedAt
    )
  }

  increaseLikes (): void {
    this.likes = this.likes + 1
  }

  decreaseLikes (): void {
    if (this.likes === 0) return
    this.likes = this.likes - 1
  }
}
