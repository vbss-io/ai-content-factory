import { ImageController } from '@/application/controllers/ImageController'
import { DeleteImageById } from '@/application/usecases/DeleteImageById'
import { GetImageById } from '@/application/usecases/GetImageById'
import { GetImages } from '@/application/usecases/GetImages'
import { GetRandomLandscapeImage } from '@/application/usecases/GetRandomLandscapeImage'
import { ProcessImage } from '@/application/usecases/ProcessImage'
import { RequestImage } from '@/application/usecases/RequestImage'
import { inject, Registry } from '@/infra/dependency-injection/Registry'
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
    const requestImage = new RequestImage()
    const getImageById = new GetImageById()
    const deleteImageById = new DeleteImageById()
    const getImages = new GetImages()
    const getRandomLandscapeImage = new GetRandomLandscapeImage()
    const processImage = new ProcessImage()
    Registry.getInstance().provide('requestImage', requestImage)
    Registry.getInstance().provide('getImageById', getImageById)
    Registry.getInstance().provide('deleteImageById', deleteImageById)
    Registry.getInstance().provide('getImages', getImages)
    Registry.getInstance().provide('getRandomLandscapeImage', getRandomLandscapeImage)
    Registry.getInstance().provide('processImage', processImage)
    new ImageController()
  }
}
