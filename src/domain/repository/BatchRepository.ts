import { type Batch } from '@/domain/entities/Batch'

export interface BatchRepository {
  create: (batch: Batch) => Promise<Batch>
  update: (batch: Batch) => Promise<void>
  findById: (id: string) => Promise<Batch | undefined>
  findAll: () => Promise<Batch[]>
}
