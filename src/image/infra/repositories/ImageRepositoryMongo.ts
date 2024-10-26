import { Image } from '@/image/domain/entities/Image'
import { type ImageRepository } from '@/image/domain/repositories/ImageRepository'
import { type ImageDocument, ImageModel } from '@/image/infra/mongoose/ImageModel'
import { type PipelineStage, Types } from 'mongoose'

export class ImageRepositoryMongo implements ImageRepository {
  async create (image: Image): Promise<Image> {
    const userDoc = new ImageModel({
      width: image.width,
      height: image.height,
      aspectRatio: image.aspectRatio,
      seed: image.seed,
      path: image.path,
      batchId: new Types.ObjectId(image.batchId)
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

  async getImagesByIds (ids: string[]): Promise<Image[] | []> {
    const findOptions = { _id: { $in: ids } }
    const imageDocs = await ImageModel.find(findOptions)
    return imageDocs.map((imageDoc) => {
      return this.toDomain(imageDoc)
    })
  }

  async getImages (page: number, searchMask?: string, sampler?: string, scheduler?: string, aspectRatio?: string, origin?: string, modelName?: string): Promise<Image[]> {
    const pageSize = 25
    const offset = (page - 1) * pageSize
    const aggregateOptions: PipelineStage[] = [
      {
        $lookup: {
          from: 'batches',
          localField: 'batchId',
          foreignField: '_id',
          as: 'batch'
        }
      }
    ]
    if (searchMask) {
      const regex = new RegExp(`${searchMask}`, 'i')
      aggregateOptions.push({
        $match: {
          $or: [
            { 'batch.prompt': regex },
            { 'batch.negativePrompt': regex }
          ]
        }
      })
    }
    if (sampler) aggregateOptions.push({ $match: { 'batch.sampler': sampler } })
    if (scheduler) aggregateOptions.push({ $match: { 'batch.scheduler': scheduler } })
    if (aspectRatio) aggregateOptions.push({ $match: { aspectRatio } })
    if (origin) aggregateOptions.push({ $match: { 'batch.origin': origin } })
    if (modelName) aggregateOptions.push({ $match: { 'batch.modelName': modelName } })
    const imageDocs = await ImageModel.aggregate(aggregateOptions).sort({ likes: -1, _id: -1 }).skip(offset).limit(pageSize)
    return imageDocs.map((imageDoc) => {
      return this.toDomain(imageDoc as ImageDocument)
    })
  }

  async getRandomLandscapeImage (): Promise<Image | undefined> {
    const [imageDoc] = await ImageModel.aggregate([
      { $match: { $expr: { $gt: ['$width', '$height'] } } },
      { $sample: { size: 1 } }
    ])
    if (!imageDoc) return
    return this.toDomain(imageDoc as ImageDocument)
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
      batchId: String(imageDoc.batchId),
      likes: imageDoc?.likes ?? 0,
      createdAt: new Date(imageDoc.createdAt),
      updatedAt: new Date(imageDoc.updatedAt)
    })
  }
}
