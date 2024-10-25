import { type Queue } from '@/@api/domain/queue/Queue'
import { QueueConnectionError } from '@/@api/infra/errors/ErrorCatalog'
import amqp from 'amqplib'

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
