import { type DatabaseConnection } from '@api/domain/database/DatabaseConnection'
import { DatabaseConnectionCloseError, DatabaseConnectionError } from '@api/infra/errors/ErrorCatalog'
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

  async close (): Promise<void> {
    try {
      await mongoose.connection.close()
    } catch {
      throw new DatabaseConnectionCloseError()
    }
  }
}
