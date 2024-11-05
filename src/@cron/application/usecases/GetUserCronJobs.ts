import { inject } from '@/@api/infra/dependency-injection/Registry'
import { type CronJobRepository } from '@/@cron/domain/repositories/CronJobRepository'
import { type GetUserCronJobsInput, type GetUserCronJobsOutput } from './dtos/GetUserCronJobs.dto'

export class GetUserCronJobs {
  @inject('cronRepository')
  private readonly cronRepository!: CronJobRepository

  async execute (input: GetUserCronJobsInput): Promise<GetUserCronJobsOutput> {
    const cronJobs = await this.cronRepository.getAll(input.userId)
    return cronJobs.map((cronJob) => {
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
    })
  }
}
