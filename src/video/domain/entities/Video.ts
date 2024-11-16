import { type VideoCreate, type VideoRestore } from '@/video/domain/entities/dtos/Video.dto'

export class Video {
  id: string
  likes: number

  private constructor (
    id: string,
    readonly width: number,
    readonly height: number,
    readonly aspectRatio: string,
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

  static create (input: VideoCreate): Video {
    return new Video(
      '',
      input.width,
      input.height,
      input.aspectRatio,
      input.path,
      input.batchId,
      0
    )
  }

  static restore (input: VideoRestore): Video {
    return new Video(
      input.id,
      input.width,
      input.height,
      input.aspectRatio,
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
