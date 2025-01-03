import { type Batch } from '@/batch/domain/entities/Batch'

export interface BatchRepository {
  create: (batch: Batch) => Promise<Batch>
  getBatchById: (id: string) => Promise<Batch | undefined>
  getBatches: (page: number, userId: string, searchMask?: string, sampler?: string, scheduler?: string, status?: string, origin?: string, modelName?: string) => Promise<Batch[]>
  update: (batch: Batch) => Promise<void>
  deleteById: (id: string) => Promise<void>
}
