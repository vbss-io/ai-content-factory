import { VideoController } from '@/application/controllers/VideoController'
import { DeleteVideoById } from '@/application/usecases/Video/DeleteVideoByIdInput'
import { GetVideoById } from '@/application/usecases/Video/GetVideoById'
import { GetVideoFilters } from '@/application/usecases/Video/GetVideoFilters'
import { GetVideos } from '@/application/usecases/Video/GetVideos'
import { LikeVideo } from '@/application/usecases/Video/LikeVideo'
import { ProcessVideo } from '@/application/usecases/Video/ProcessVideo'
import { RequestVideo } from '@/application/usecases/Video/RequestVideo'
import { inject, Registry } from '@/infra/dependency-injection/Registry'
import { GetVideoFiltersQueryMongo } from '@/infra/mongodb/queries/GetVideoFiltersMongo'
import { VideoRepositoryMongo } from '@/infra/mongodb/repository/VideoRepositoryMongo'
import { type Queue } from '@/infra/queue/Queue'
import { RequestVideoSchema } from '@/infra/schemas/RequestVideoSchema'
import { ZodAdapter } from '@/infra/validate/InputValidate'

export class VideoModule {
  @inject('queue')
  private readonly queue!: Queue

  constructor () {
    void this.queue.register('videoRequested', 'videoRequested.processVideo')
    const requestVideoValidate = new ZodAdapter(RequestVideoSchema)
    Registry.getInstance().provide('requestVideoValidate', requestVideoValidate)
    const videoRepository = new VideoRepositoryMongo()
    Registry.getInstance().provide('videoRepository', videoRepository)
    const getVideoFiltersQuery = new GetVideoFiltersQueryMongo()
    Registry.getInstance().provide('getVideoFiltersQuery', getVideoFiltersQuery)
    const requestVideo = new RequestVideo()
    const processVideo = new ProcessVideo()
    const getVideoById = new GetVideoById()
    const getVideos = new GetVideos()
    const deleteVideoById = new DeleteVideoById()
    const getVideoFilters = new GetVideoFilters()
    const likeVideo = new LikeVideo()
    Registry.getInstance().provide('requestVideo', requestVideo)
    Registry.getInstance().provide('processVideo', processVideo)
    Registry.getInstance().provide('getVideoById', getVideoById)
    Registry.getInstance().provide('getVideos', getVideos)
    Registry.getInstance().provide('deleteVideoById', deleteVideoById)
    Registry.getInstance().provide('getVideoFilters', getVideoFilters)
    Registry.getInstance().provide('likeVideo', likeVideo)
    new VideoController()
  }
}
