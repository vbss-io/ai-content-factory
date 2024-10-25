export interface Queue {
  connect: () => Promise<void>
  register: (exchangeName: string, queueName: string) => Promise<void>
  publish: (exchangeName: string, data: any) => Promise<void>
  consume: (queueName: string, callback: any) => Promise<void>
}
