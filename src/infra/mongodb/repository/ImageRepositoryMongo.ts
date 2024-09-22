import { Image } from '@/domain/entities/Image'
import { type ImageRepository } from '@/domain/repository/ImageRepository'
import { type ImageDocument, ImageModel } from '@/infra/mongodb/model/ImageModel'

export class ImageRepositoryMongo implements ImageRepository {
  async create (image: Image): Promise<Image> {
    const userDoc = new ImageModel({
      width: image.width,
      height: image.height,
      seed: image.seed,
      info: image.info,
      path: image.path
    })
    const savedDoc = await userDoc.save()
    return this.toDomain(savedDoc)
  }

  private toDomain (imageDoc: ImageDocument): Image {
    const id = imageDoc._id as any
    return Image.restore({
      id: id.toString(),
      width: imageDoc.width,
      height: imageDoc.height,
      seed: imageDoc.seed,
      info: imageDoc.info,
      path: imageDoc.path,
      createdAt: imageDoc.createdAt,
      updatedAt: imageDoc.updatedAt
    })
  }
}
