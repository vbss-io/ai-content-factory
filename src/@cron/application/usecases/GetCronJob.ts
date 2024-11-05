import { inject } from '@/@api/infra/dependency-injection/Registry'
import { type CronJobRepository } from '@/@cron/domain/repositories/CronJobRepository'
import { CronNotFoundError } from '@/@cron/infra/errors/CronErrorCatalog'
import { type GetCronJobInput, type GetCronJobOutput } from './dtos/GetCronJob.dto'

export class GetCronJob {
  @inject('cronRepository')
  private readonly cronRepository!: CronJobRepository

  async execute (input: GetCronJobInput): Promise<GetCronJobOutput> {
    const cronJob = await this.cronRepository.getById(input.id, input.userId)
    if (!cronJob) throw new CronNotFoundError()
    return {
      id: cronJob.id,
      userId: cronJob.userId,
      status: cronJob.status,
      cronTime: cronJob.cronTime,
      customPrompt: cronJob.customPrompt ?? '',
      customAspectRatio: cronJob.customAspectRatio ?? '',
      genImages: cronJob.genImages,
      genVideos: cronJob.genVideos,
      origins: cronJob.origins,
      batches: cronJob.batches
    }
  }
}
