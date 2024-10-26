import { BatchModel } from '@/batch/infra/mongoose/BatchModel'
import { type GetImageFiltersQueryOutput } from '@/image/domain/queries/dtos/GetImageFiltersQuery.dto'
import { type GetImageFiltersQuery } from '@/image/domain/queries/GetImageFiltersQuery'
import { ImageModel } from '@/image/infra/mongoose/ImageModel'

export class GetImageFiltersQueryMongo implements GetImageFiltersQuery {
  async execute (): Promise<GetImageFiltersQueryOutput> {
    const sampler = await BatchModel.find({}, { _id: 0, sampler: 1 }).distinct('sampler')
    const scheduler = await BatchModel.find({}, { _id: 0, scheduler: 1 }).distinct('scheduler')
    const aspectRatio = await ImageModel.find({}, { _id: 0, aspectRatio: 1 }).distinct('aspectRatio')
    const origin = await BatchModel.find({}, { _id: 0, origin: 1 }).distinct('origin')
    const modelName = await BatchModel.find({}, { _id: 0, modelName: 1 }).distinct('modelName')
    return {
      sampler,
      scheduler,
      aspectRatio,
      origin,
      modelName
    }
  }
}
