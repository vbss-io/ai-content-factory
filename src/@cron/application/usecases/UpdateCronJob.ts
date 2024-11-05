import { inject } from '@/@api/infra/dependency-injection/Registry'
import { type Cron } from '@/@cron/domain/cron/Cron'
import { type CronJobRepository } from '@/@cron/domain/repositories/CronJobRepository'
import { CronNotFoundError } from '@/@cron/infra/errors/CronErrorCatalog'
import { type UpdateCronJobInput, type UpdateCronJobOutput } from './dtos/UpdateCronJob.dto'

export class UpdateCronJob {
  @inject('cronRepository')
  private readonly cronRepository!: CronJobRepository

  @inject('cron')
  private readonly cron!: Cron

  async execute (input: UpdateCronJobInput): Promise<UpdateCronJobOutput> {
    const cronJob = await this.cronRepository.getById(input.id, input.userId)
    if (!cronJob) throw new CronNotFoundError()
    cronJob.update({
      cronTime: input.cronTime,
      customPrompt: input.customPrompt,
      customAspectRatio: input.customAspectRatio,
      genImages: input.genImages,
      genVideos: input.genVideos,
      origins: input.origins
    })
    this.cron.deleteCronJob(cronJob.id)
    await this.cronRepository.update(cronJob)
    cronJob.setCallback(() => { console.log(`cron ${cronJob.id} update`) })
    this.cron.createCronJob(cronJob)
    return {
      jobId: cronJob.id,
      status: cronJob.status
    }
  }
}
