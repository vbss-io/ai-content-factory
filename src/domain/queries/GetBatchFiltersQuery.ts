import { type GetBatchFiltersQueryOutput } from '@/domain/queries/dto/GetBatchFiltersQuery.dto'

export interface GetBatchFiltersQuery {
  execute: () => Promise<GetBatchFiltersQueryOutput>
}
