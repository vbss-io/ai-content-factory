import { CronAdapter } from '@/@api/infra/cron/CronAdapter'

export class AutomaticVideoModule {
  constructor () {
    const automaticVideoCron = new CronAdapter('0 */12 * * *', async () => {
      console.log('Automatic Video Not Implemented')
    })
    void automaticVideoCron.start()
  }
}
