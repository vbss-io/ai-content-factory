import { QueueConnectionError } from '@/infra/error/ErrorCatalog'
import amqp from 'amqplib'

export interface Queue {
  connect: () => Promise<void>
  register: (exchangeName: string, queueName: string) => Promise<void>
  publish: (exchangeName: string, data: any) => Promise<void>
  consume: (queueName: string, callback: any) => Promise<void>
}

export class RabbitMQAdapter implements Queue {
  connection: any

  async connect (): Promise<void> {
    try {
      this.connection = await amqp.connect('amqp://localhost')
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
      } catch {
        channel.reject(msg, true)
      }
    })
  }
}