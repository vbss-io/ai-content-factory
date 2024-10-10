import { type ImageCreate, type ImageRestore } from '@/domain/entities/dto/Image.dto'
import { AspectRatio } from './vo/AspectRatio'

export class Image {
  id: string

  private constructor (
    id: string,
    readonly width: number,
    readonly height: number,
    readonly aspectRatio: string,
    readonly seed: number,
    readonly path: string,
    readonly batchId: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.id = id
  }

  static create (input: ImageCreate): Image {
    const aspectRatio = new AspectRatio(input.width, input.height)

    return new Image(
      '',
      input.width,
      input.height,
      aspectRatio.getValue(),
      input.seed,
      input.path,
      input.batchId
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
      input.createdAt,
      input.updatedAt
    )
  }
}
