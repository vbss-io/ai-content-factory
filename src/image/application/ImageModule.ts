import { ImageController } from '@/image/application/controllers/ImageController'
import { DeleteImageById } from '@/image/application/usecases/DeleteImageById'
import { GetImageById } from '@/image/application/usecases/GetImageById'
import { GetImageFilters } from '@/image/application/usecases/GetImageFilters'
import { GetImages } from '@/image/application/usecases/GetImages'
import { GetRandomLandscapeImage } from '@/image/application/usecases/GetRandomLandscapeImage'
import { LikeImage } from '@/image/application/usecases/LikeImage'
import { ProcessImage } from '@/image/application/usecases/ProcessImage'
import { RequestImage } from '@/image/application/usecases/RequestImage'
import { GetImageFiltersQueryMongo } from '@/image/infra/queries/GetImageFiltersMongo'
import { ImageRepositoryMongo } from '@/image/infra/repositories/ImageRepositoryMongo'
import { RequestImageSchema } from '@/image/infra/schemas/RequestImageSchema'
import { AzureImageStorageAdapter } from '@/image/infra/storage/AzureImageStorageAdapter'
import { type Queue } from '@api/domain/queue/Queue'
import { inject, Registry } from '@api/infra/dependency-injection/Registry'
import { ByIdSchema } from '@api/infra/schemas/ByIdSchema'
import { GetAllSchema } from '@api/infra/schemas/GetAllSchema'
import { ZodAdapter } from '@api/infra/validate/ZodAdapter'
import { GetUserImages } from './usecases/GetUserImages'

export class ImageModule {
  @inject('queue')
  private readonly queue!: Queue

  constructor () {
    void this.queue.register('imageRequested', 'imageRequested.processImage')
    const imageStorage = new AzureImageStorageAdapter()
    Registry.getInstance().provide('imageStorage', imageStorage)
    const requestImageValidate = new ZodAdapter(RequestImageSchema)
    const byIdValidate = new ZodAdapter(ByIdSchema)
    const getAllValidate = new ZodAdapter(GetAllSchema)
    Registry.getInstance().provide('requestImageValidate', requestImageValidate)
    Registry.getInstance().provide('byIdValidate', byIdValidate)
    Registry.getInstance().provide('getAllValidate', getAllValidate)
    const imageRepository = new ImageRepositoryMongo()
    Registry.getInstance().provide('imageRepository', imageRepository)
    const getImageFiltersQuery = new GetImageFiltersQueryMongo()
    Registry.getInstance().provide('getImageFiltersQuery', getImageFiltersQuery)
    const requestImage = new RequestImage()
    const getImageById = new GetImageById()
    const deleteImageById = new DeleteImageById()
    const getImages = new GetImages()
    const getUserImages = new GetUserImages()
    const getRandomLandscapeImage = new GetRandomLandscapeImage()
    const processImage = new ProcessImage()
    const getImageFilters = new GetImageFilters()
    const likeImage = new LikeImage()
    Registry.getInstance().provide('requestImage', requestImage)
    Registry.getInstance().provide('getImageById', getImageById)
    Registry.getInstance().provide('deleteImageById', deleteImageById)
    Registry.getInstance().provide('getImages', getImages)
    Registry.getInstance().provide('getUserImages', getUserImages)
    Registry.getInstance().provide('getRandomLandscapeImage', getRandomLandscapeImage)
    Registry.getInstance().provide('processImage', processImage)
    Registry.getInstance().provide('getImageFilters', getImageFilters)
    Registry.getInstance().provide('likeImage', likeImage)
    new ImageController()
  }
}
