import { type Batch } from '@/domain/entities/Batch'

export interface GetBatchesInput {
  search_mask?: string
  page: number
}

export type GetBatchesOutput = Batch[]
