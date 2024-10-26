import { type GetBatchFiltersQuery } from '@/batch/domain/queries/GetBatchFiltersQuery'
import { type GetBatchFiltersQueryOutput } from '@/batch/domain/queries/dtos/GetBatchFiltersQuery.dto'
import { BatchModel } from '@/batch/infra/mongoose/BatchModel'

export class GetBatchFiltersQueryMongo implements GetBatchFiltersQuery {
  async execute (): Promise<GetBatchFiltersQueryOutput> {
    const sampler = await BatchModel.find({}, { _id: 0, sampler: 1 }).distinct('sampler')
    const scheduler = await BatchModel.find({}, { _id: 0, scheduler: 1 }).distinct('scheduler')
    const status = await BatchModel.find({}, { _id: 0, status: 1 }).distinct('status')
    const origin = await BatchModel.find({}, { _id: 0, origin: 1 }).distinct('origin')
    const modelName = await BatchModel.find({}, { _id: 0, modelName: 1 }).distinct('modelName')
    return {
      sampler,
      scheduler,
      status,
      origin,
      modelName
    }
  }
}
