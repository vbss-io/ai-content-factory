import { BatchModel } from '@/batch/infra/mongoose/BatchModel'
import { type GetVideoFiltersQueryOutput } from '@/video/domain/queries/dtos/GetVideoFiltersQuery.dto'
import { type GetVideoFiltersQuery } from '@/video/domain/queries/GetVideoFiltersQuery'
import { VideoModel } from '@/video/infra/mongoose/VideoModel'

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
