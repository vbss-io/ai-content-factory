import { CronJob } from '@/@cron/domain/entities/CronJob'
import { type CronJobRepository } from '@/@cron/domain/repositories/CronJobRepository'
import { type CronJobDocument, CronJobModel } from '@/@cron/infra/mongoose/CronJobModel'

export class CronJobRepositoryMongo implements CronJobRepository {
  async create (cron: CronJob): Promise<CronJob> {
    const cronDoc = new CronJobModel({
      userId: cron.userId,
      status: cron.status,
      cronTime: cron.cronTime,
      customPrompt: cron.customPrompt,
      customAspectRatio: cron.customAspectRatio,
      genImages: cron.genImages,
      genVideos: cron.genVideos,
      origins: cron.origins,
      batches: cron.batches
    })
    const savedDoc = await cronDoc.save()
    return this.toDomain(savedDoc)
  }

  async getById (id: string, userId: string): Promise<CronJob | undefined> {
    const cronDoc = await CronJobModel.findOne({ _id: id, userId })
    if (!cronDoc) return
    return this.toDomain(cronDoc)
  }

  async update (cron: CronJob): Promise<void> {
    const { id, ...rest } = cron
    await CronJobModel.findByIdAndUpdate(id, { ...rest }, { new: true }).exec()
  }

  async deleteById (id: string): Promise<void> {
    await CronJobModel.findOneAndDelete({ _id: id })
  }

  async getAll (userId: string): Promise<CronJob[] | []> {
    const cronDocs = await CronJobModel.find({ userId })
    return cronDocs.map((cronDoc) => {
      return this.toDomain(cronDoc)
    })
  }

  async getAllByStatus (status: string): Promise<CronJob[] | []> {
    const cronDocs = await CronJobModel.find({ status })
    return cronDocs.map((cronDoc) => {
      return this.toDomain(cronDoc)
    })
  }

  private toDomain (cronDoc: CronJobDocument): CronJob {
    const id = cronDoc._id as any
    return CronJob.restore({
      id: id.toString(),
      userId: cronDoc.userId.toString(),
      status: cronDoc.status,
      cronTime: cronDoc.cronTime,
      customPrompt: cronDoc.customPrompt,
      customAspectRatio: cronDoc.customAspectRatio,
      genImages: cronDoc.genImages,
      genVideos: cronDoc.genVideos,
      origins: cronDoc.origins,
      batches: cronDoc.batches,
      createdAt: cronDoc.createdAt,
      updatedAt: cronDoc.updatedAt
    })
  }
}
