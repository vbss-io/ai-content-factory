import { type GetBatchFiltersQueryOutput } from '@/domain/queries/dtos/GetBatchFiltersQuery.dto'

export interface GetBatchFiltersQuery {
  execute: () => Promise<GetBatchFiltersQueryOutput>
}
