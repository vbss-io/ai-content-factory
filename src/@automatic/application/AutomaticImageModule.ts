import { CronAdapter } from '@/@api/infra/cron/CronAdapter'
import { AutomaticRequestImage } from '@/image/application/usecases/AutomaticRequestImage'

export class AutomaticImageModule {
  constructor () {
    const automaticRequestImage = new AutomaticRequestImage()
    const automaticImageCron = new CronAdapter('0 */12 * * *', async () => {
      await automaticRequestImage.execute()
    })
    void automaticImageCron.start()
  }
}
