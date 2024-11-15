import { VideoController } from '@/video/application/controllers/VideoController'
import { DeleteVideoById } from '@/video/application/usecases/DeleteVideoByIdInput'
import { GetVideoById } from '@/video/application/usecases/GetVideoById'
import { GetVideoFilters } from '@/video/application/usecases/GetVideoFilters'
import { GetVideos } from '@/video/application/usecases/GetVideos'
import { LikeVideo } from '@/video/application/usecases/LikeVideo'
import { ProcessVideo } from '@/video/application/usecases/ProcessVideo'
import { RequestVideo } from '@/video/application/usecases/RequestVideo'
import { GetVideoFiltersQueryMongo } from '@/video/infra/queries/GetVideoFiltersMongo'
import { VideoRepositoryMongo } from '@/video/infra/repositories/VideoRepositoryMongo'
import { RequestVideoSchema } from '@/video/infra/schemas/RequestVideoSchema'
import { AzureVideoStorageAdapter } from '@/video/infra/storage/AzureVideoStorageAdapter'
import { type Queue } from '@api/domain/queue/Queue'
import { inject, Registry } from '@api/infra/dependency-injection/Registry'
import { ZodAdapter } from '@api/infra/validate/ZodAdapter'
import { GetUserVideos } from './usecases/GetUserVideos'

export class VideoModule {
  @inject('queue')
  private readonly queue!: Queue

  constructor () {
    void this.queue.register('videoRequested', 'videoRequested.processVideo')
    const videoStorage = new AzureVideoStorageAdapter()
    Registry.getInstance().provide('videoStorage', videoStorage)
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
    const getUserVideos = new GetUserVideos()
    const deleteVideoById = new DeleteVideoById()
    const getVideoFilters = new GetVideoFilters()
    const likeVideo = new LikeVideo()
    Registry.getInstance().provide('requestVideo', requestVideo)
    Registry.getInstance().provide('processVideo', processVideo)
    Registry.getInstance().provide('getVideoById', getVideoById)
    Registry.getInstance().provide('getVideos', getVideos)
    Registry.getInstance().provide('getUserVideos', getUserVideos)
    Registry.getInstance().provide('deleteVideoById', deleteVideoById)
    Registry.getInstance().provide('getVideoFilters', getVideoFilters)
    Registry.getInstance().provide('likeVideo', likeVideo)
    new VideoController()
  }
}
