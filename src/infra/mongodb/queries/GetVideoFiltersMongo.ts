import { type GetVideoFiltersQueryOutput } from '@/domain/queries/dto/GetVideoFiltersQuery.dto'
import { type GetVideoFiltersQuery } from '@/domain/queries/GetVideoFiltersQuery'
import { BatchModel } from '@/infra/mongodb/model/BatchModel'
import { VideoModel } from '@/infra/mongodb/model/VideoModel'

export class GetVideoFiltersQueryMongo implements GetVideoFiltersQuery {
  async execute (): Promise<GetVideoFiltersQueryOutput> {
    const aspectRatio = await VideoModel.find({}, { _id: 0, aspectRatio: 1 }).distinct('aspectRatio')
    const origin = await BatchModel.find({ videos: { $exists: true, $ne: [] } }, { _id: 0, origin: 1 }).distinct('origin')
    const modelName = await BatchModel.find({ videos: { $exists: true, $ne: [] } }, { _id: 0, modelName: 1 }).distinct('modelName')
    return {
      aspectRatio,
      origin,
      modelName
    }
  }
}
