import { type Queue } from '@api/domain/queue/Queue'

export class InMemoryQueueAdapter implements Queue {
  private readonly queues: Map<string, any[]>

  constructor () {
    this.queues = new Map()
  }

  async connect (): Promise<void> {
    console.log('Connected to in-memory queue')
  }

  async register (queueName: string): Promise<void> {
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, [])
    }
  }

  async publish (queueName: string, data: any): Promise<void> {
    if (this.queues.has(queueName)) {
      const queue = this.queues.get(queueName)
      if (queue) {
        queue.push(data)
      }
    } else {
      console.error(`Queue ${queueName} does not exist`)
    }
  }

  async consume (queueName: string, callback: (data: any) => Promise<void>): Promise<void> {
    if (!this.queues.has(queueName.split('.')[0])) {
      console.error(`Queue ${queueName} does not exist`)
      return
    }
    const queue = this.queues.get(queueName.split('.')[0])
    const processQueue = async (): Promise<void> => {
      if (queue) {
        while (queue.length > 0) {
          const data = queue.shift()
          try {
            await callback(data)
          } catch (error) {
            console.error('Error processing message:', error)
          }
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setInterval(async () => {
      await processQueue()
    }, 1000)
  }
}
