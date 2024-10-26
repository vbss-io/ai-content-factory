import { type GetBatchFiltersQueryOutput } from '@/batch/domain/queries/dtos/GetBatchFiltersQuery.dto'

export interface GetBatchFiltersQuery {
  execute: () => Promise<GetBatchFiltersQueryOutput>
}
