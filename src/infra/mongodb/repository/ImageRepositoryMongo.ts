import { Image } from '@/domain/entities/Image'
import { type ImageRepository } from '@/domain/repository/ImageRepository'
import { type ImageDocument, ImageModel } from '@/infra/mongodb/model/ImageModel'

export class ImageRepositoryMongo implements ImageRepository {
  async create (image: Image): Promise<Image> {
    const userDoc = new ImageModel({
      prompt: image.prompt,
      width: image.width,
      height: image.height
    })
    const savedDoc = await userDoc.save()
    return this.toDomain(savedDoc)
  }

  private toDomain (imageDoc: ImageDocument): Image {
    const id = imageDoc._id as any
    return Image.restore({
      id: id.toString(),
      prompt: imageDoc.prompt,
      width: imageDoc.width,
      height: imageDoc.height,
      createdAt: imageDoc.createdAt,
      updatedAt: imageDoc.updatedAt
    })
  }
}
