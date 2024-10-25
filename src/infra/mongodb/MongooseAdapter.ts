import { type DatabaseConnection } from '@/domain/database/DatabaseConnection'
import { DatabaseConnectionError } from '@/infra/errors/ErrorCatalog'
import mongoose from 'mongoose'

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
