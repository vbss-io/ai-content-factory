import { type Cron } from '@api/domain/cron/Cron'
import { CronJob } from 'cron'

export class CronAdapter implements Cron {
  cronJob: CronJob | undefined
  cronTime: string
  callback: () => any

  constructor (cronTime: string, callback: () => any) {
    if (!cronTime || !callback) {
      throw new Error('Failed to start cron job')
    }
    this.cronTime = cronTime
    this.callback = callback
  }

  async start (): Promise<void> {
    const cron = CronJob.from({
      cronTime: this.cronTime,
      onTick: this.callback,
      start: false,
      timeZone: 'America/Sao_Paulo'
    })
    process.env.NODE_ENV !== 'test' && cron.start()
  }
}
