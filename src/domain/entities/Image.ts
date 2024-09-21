import { type ImageCreate, type ImageRestore } from '@/domain/entities/dto/Image.dto'

export class Image {
  id?: string

  private constructor (
    id: string | undefined,
    readonly width: number,
    readonly height: number,
    readonly seed: number,
    readonly info: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.id = id
  }

  static create (input: ImageCreate): Image {
    return new Image(
      undefined,
      input.width,
      input.height,
      input.seed,
      input.info
    )
  }

  static restore (input: ImageRestore): Image {
    return new Image(
      input.id,
      input.width,
      input.height,
      input.seed,
      input.info,
      input.createdAt,
      input.updatedAt
    )
  }
}
