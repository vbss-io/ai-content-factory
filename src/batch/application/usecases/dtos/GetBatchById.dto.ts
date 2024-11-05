import { type Batch } from '@/batch/domain/entities/Batch'

export interface GetBatchByIdInput {
  id: string
  userId: string
}

export type GetBatchByIdOutput = Batch
