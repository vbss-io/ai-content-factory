import { ImageController } from '@/application/controllers/ImageController'
import { DeleteImageById } from '@/application/usecases/Image/DeleteImageById'
import { GetImageById } from '@/application/usecases/Image/GetImageById'
import { GetImageFilters } from '@/application/usecases/Image/GetImageFilters'
import { GetImages } from '@/application/usecases/Image/GetImages'
import { GetRandomLandscapeImage } from '@/application/usecases/Image/GetRandomLandscapeImage'
import { ProcessImage } from '@/application/usecases/Image/ProcessImage'
import { RequestImage } from '@/application/usecases/Image/RequestImage'
import { inject, Registry } from '@/infra/dependency-injection/Registry'
import { GetImageFiltersQueryMongo } from '@/infra/mongodb/queries/GetImageFiltersMongo'
import { ImageRepositoryMongo } from '@/infra/mongodb/repository/ImageRepositoryMongo'
import { type Queue } from '@/infra/queue/Queue'
import { ByIdSchema } from '@/infra/schemas/ByIdSchema'
import { GetAllSchema } from '@/infra/schemas/GetAllSchema'
import { RequestImageSchema } from '@/infra/schemas/RequestImageSchema'
import { ZodAdapter } from '@/infra/validate/InputValidate'

export class ImageModule {
  @inject('queue')
  private readonly queue!: Queue

  constructor () {
    void this.queue.register('imageRequested', 'imageRequested.processImage')
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
    const getRandomLandscapeImage = new GetRandomLandscapeImage()
    const processImage = new ProcessImage()
    const getImageFilters = new GetImageFilters()
    Registry.getInstance().provide('requestImage', requestImage)
    Registry.getInstance().provide('getImageById', getImageById)
    Registry.getInstance().provide('deleteImageById', deleteImageById)
    Registry.getInstance().provide('getImages', getImages)
    Registry.getInstance().provide('getRandomLandscapeImage', getRandomLandscapeImage)
    Registry.getInstance().provide('processImage', processImage)
    Registry.getInstance().provide('getImageFilters', getImageFilters)
    new ImageController()
  }
}
