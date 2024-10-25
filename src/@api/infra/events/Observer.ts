import type { DomainEvent } from '@api/domain/events/DomainEvent'

export class Observable {
  observers: Array<{ eventName: string, callback: any }>

  constructor () {
    this.observers = []
  }

  register (eventName: string, callback: any): void {
    this.observers.push({ eventName, callback })
  }

  async notify (event: DomainEvent): Promise<any> {
    for (const observer of this.observers) {
      if (observer.eventName === event.eventName) {
        await observer.callback(event)
      }
    }
  }
}
