import { type Batch } from '@/domain/entities/Batch'

export interface GetBatchByIdInput {
  id: string
}

export type GetBatchByIdOutput = Batch
