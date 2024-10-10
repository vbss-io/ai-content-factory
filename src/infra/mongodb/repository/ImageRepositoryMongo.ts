import { Image } from '@/domain/entities/Image'
import { type ImageRepository } from '@/domain/repository/ImageRepository'
import { type ImageDocument, ImageModel } from '@/infra/mongodb/model/ImageModel'

export class ImageRepositoryMongo implements ImageRepository {
  async create (image: Image): Promise<Image> {
    const userDoc = new ImageModel({
      width: image.width,
      height: image.height,
      aspectRatio: image.aspectRatio,
      seed: image.seed,
      path: image.path,
      batchId: image.batchId
    })
    const savedDoc = await userDoc.save()
    return this.toDomain(savedDoc)
  }

  async update (image: Image): Promise<void> {
    const { id, ...rest } = image
    await ImageModel.findByIdAndUpdate(id, { ...rest }, { new: true }).exec()
  }

  async deleteById (id: string): Promise<void> {
    await ImageModel.findOneAndDelete({ _id: id })
  }

  async getImageById (id: string): Promise<Image | undefined> {
    const imageDoc = await ImageModel.findById(id)
    if (!imageDoc) return
    return this.toDomain(imageDoc)
  }

  async getImages (page: number, searchMask?: string): Promise<Image[]> {
    const pageSize = 25
    const offset = (page - 1) * pageSize
    const imageDocs = await ImageModel.find().skip(offset).limit(pageSize)
    return imageDocs.map((imageDoc) => {
      return this.toDomain(imageDoc)
    })
  }

  private toDomain (imageDoc: ImageDocument): Image {
    const id = imageDoc._id as any
    return Image.restore({
      id: id.toString(),
      width: imageDoc.width,
      height: imageDoc.height,
      aspectRatio: imageDoc.aspectRatio,
      seed: imageDoc.seed,
      path: imageDoc.path,
      batchId: imageDoc.batchId,
      createdAt: imageDoc.createdAt,
      updatedAt: imageDoc.updatedAt
    })
  }
}
