import { Batch } from '@/domain/entities/Batch'
import { type BatchRepository } from '@/domain/repository/BatchRepository'
import { type BatchDocument, BatchModel } from '@/infra/mongodb/model/BatchModel'

export class BatchRepositoryMongo implements BatchRepository {
  async create (batch: Batch): Promise<Batch> {
    const userDoc = new BatchModel({
      status: batch.status,
      prompt: batch.prompt,
      negativePrompt: batch.negativePrompt,
      sampler: batch.sampler,
      scheduler: batch.scheduler,
      steps: batch.steps,
      modelName: batch.modelName,
      images: batch.images,
      origin: batch.origin,
      size: batch.size
    })
    const savedDoc = await userDoc.save()
    return this.toDomain(savedDoc)
  }

  async update (batch: Batch): Promise<void> {
    const { id, ...rest } = batch
    await BatchModel.findByIdAndUpdate(id, { ...rest }, { new: true }).exec()
  }

  async deleteById (id: string): Promise<void> {
    await BatchModel.findOneAndDelete({ _id: id })
  }

  async getBatchById (id: string): Promise<Batch | undefined> {
    const batchDoc = await BatchModel.findById(id)
    if (!batchDoc) return
    return this.toDomain(batchDoc)
  }

  async getBatches (page: number, searchMask?: string, sampler?: string, scheduler?: string, status?: string, origin?: string, modelName?: string): Promise<Batch[]> {
    const pageSize = 25
    const offset = (page - 1) * pageSize
    const findOptions = {}
    if (searchMask) {
      const regex = new RegExp(`${searchMask}`, 'i')
      Object.assign(findOptions, {
        $or: [
          { prompt: regex },
          { negativePrompt: regex }
        ]
      })
    }
    if (sampler) Object.assign(findOptions, { sampler })
    if (scheduler) Object.assign(findOptions, { scheduler })
    if (status) Object.assign(findOptions, { status })
    if (origin) Object.assign(findOptions, { origin })
    if (modelName) Object.assign(findOptions, { modelName })
    const batchDocs = await BatchModel.find(findOptions).skip(offset).limit(pageSize)
    return batchDocs.map((batchDoc) => {
      return this.toDomain(batchDoc)
    })
  }

  private toDomain (batchDoc: BatchDocument): Batch {
    const id = batchDoc._id as any
    return Batch.restore({
      id: id.toString(),
      status: batchDoc.status,
      prompt: batchDoc.prompt,
      negativePrompt: batchDoc.negativePrompt,
      sampler: batchDoc.sampler,
      scheduler: batchDoc.scheduler,
      steps: batchDoc.steps,
      modelName: batchDoc.modelName,
      images: batchDoc.images,
      origin: batchDoc.origin,
      size: batchDoc.size,
      errorMessage: batchDoc.errorMessage,
      createdAt: batchDoc.createdAt,
      updatedAt: batchDoc.updatedAt
    })
  }
}
