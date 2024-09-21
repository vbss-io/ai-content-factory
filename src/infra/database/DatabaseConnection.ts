import { DatabaseConnectionError } from '@/infra/error/ErrorCatalog'
import mongoose from 'mongoose'

export interface DatabaseConnection {
  connect: () => Promise<void>
}

export class MongooseAdapter implements DatabaseConnection {
  connection: string

  constructor (readonly connectionString: string) {
    this.connection = connectionString
  }

  async connect (): Promise<void> {
    try {
      await mongoose.connect(this.connection)
    } catch {
      throw new DatabaseConnectionError()
    }
  }
}
