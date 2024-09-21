import { type ImageCreate } from '@/domain/entities/dto/Image.dto'

export class Image {
  id?: string | undefined
  private constructor (
    id: string | undefined,
    readonly prompt: string,
    readonly width: number,
    readonly height: number,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.id = id
  }

  static create (input: ImageCreate): Image {
    return new Image(
      undefined,
      input.prompt,
      input.width,
      input.height
    )
  }

  static restore (input: Image): Image {
    return new Image(
      input.id,
      input.prompt,
      input.width,
      input.height,
      input.createdAt,
      input.updatedAt
    )
  }
}
