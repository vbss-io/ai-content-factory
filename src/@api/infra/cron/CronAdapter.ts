import { type Cron } from '@/@api/domain/cron/Cron'
import { AutomaticRequestImage } from '@/application/usecases/Image/AutomaticRequestImage'
import { CronJob } from 'cron'

export class CronAdapter implements Cron {
  cronJob: CronJob | undefined

  async start (): Promise<void> {
    const cron = CronJob.from({
      cronTime: '0 */12 * * *',
      // eslint-disable-next-line @typescript-eslint/unbound-method
      onTick: this.run,
      start: false,
      timeZone: 'America/Sao_Paulo'
    })
    process.env.NODE_ENV !== 'test' && cron.start()
  }

  async run (): Promise<void> {
    const automaticRequestImage = new AutomaticRequestImage()
    try {
      await automaticRequestImage.execute()
    } catch (error) {
      console.error(error)
    }
  }
}
