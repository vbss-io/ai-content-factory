import { QueueConnectionError } from '@/infra/error/ErrorCatalog'
import amqp from 'amqplib'

export interface Queue {
  connect: () => Promise<void>
  register: (exchangeName: string, queueName: string) => Promise<void>
  publish: (exchangeName: string, data: any) => Promise<void>
  consume: (queueName: string, callback: any) => Promise<void>
}

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

export class RabbitMQAdapter implements Queue {
  connection: any

  async connect (): Promise<void> {
    try {
      this.connection = await amqp.connect(String(process.env.QUEUE_URI))
    } catch {
      throw new QueueConnectionError()
    }
  }

  async register (exchangeName: string, queueName: string): Promise<void> {
    const channel = await this.connection.createChannel()
    await channel.assertExchange(exchangeName, 'direct', { durable: true })
    await channel.assertQueue(queueName, { durable: true })
    await channel.bindQueue(queueName, exchangeName)
  }

  async publish (exchangeName: string, data: any): Promise<void> {
    const channel = await this.connection.createChannel()
    await channel.publish(exchangeName, '', Buffer.from(JSON.stringify(data)))
  }

  async consume (queueName: string, callback: any): Promise<void> {
    const channel = await this.connection.createChannel()
    channel.consume(queueName, async function (msg: any) {
      try {
        const input = JSON.parse(msg.content.toString() as string)
        await callback(input)
        await channel.ack(msg)
      } catch (error: any) {
        if (error?.message?.includes('Midjourney')) {
          await channel.ack(msg)
        } else {
          await channel.reject(msg, true)
        }
      }
    })
  }
}
