import { ImageController } from '@/application/controllers/ImageController'
import { ProcessImage } from '@/application/usecases/ProcessImage'
import { RequestImage } from '@/application/usecases/RequestImage'
import { inject, Registry } from '@/infra/dependency-injection/Registry'
import { StableDiffusionGatewayHttp } from '@/infra/gateways/ImagineImageGateway'
import { BatchRepositoryMongo } from '@/infra/mongodb/repository/BatchRepositoryMongo'
import { ImageRepositoryMongo } from '@/infra/mongodb/repository/ImageRepositoryMongo'
import { type Queue } from '@/infra/queue/Queue'
import { RequestImageSchema } from '@/infra/schemas/RequestImageSchema'
import { ZodAdapter } from '@/infra/validate/InputValidate'

export class ImageModule {
  @inject('queue')
  private readonly queue!: Queue

  constructor () {
    void this.queue.register('imageRequested', 'imageRequested.processImage')
    const requestImageValidate = new ZodAdapter(RequestImageSchema)
    Registry.getInstance().provide('requestImageValidate', requestImageValidate)
    const imagineImageGateway = new StableDiffusionGatewayHttp()
    Registry.getInstance().provide('imagineImageGateway', imagineImageGateway)
    const imageRepository = new ImageRepositoryMongo()
    const batchRepository = new BatchRepositoryMongo()
    Registry.getInstance().provide('imageRepository', imageRepository)
    Registry.getInstance().provide('batchRepository', batchRepository)
    const requestImage = new RequestImage()
    const processImage = new ProcessImage()
    Registry.getInstance().provide('requestImage', requestImage)
    Registry.getInstance().provide('processImage', processImage)
    new ImageController()
  }
}
