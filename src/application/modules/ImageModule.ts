import { ImagineController } from '@/application/controllers/ImageController'
import { ImagineImage } from '@/application/usecases/ImagineImage'
import { Registry } from '@/infra/dependency-injection/Registry'
import { StableDiffusionGatewayHttp } from '@/infra/gateways/ImagineImageGateway'
import { ImageRepositoryMongo } from '@/infra/mongodb/repository/ImageRepositoryMongo'
import { ImagineImageSchema } from '@/infra/schemas/ImagineImageSchema'
import { ZodAdapter } from '@/infra/validate/InputValidate'

export class ImageModule {
  constructor () {
    const imagineImageValidate = new ZodAdapter(ImagineImageSchema)
    Registry.getInstance().provide('imagineImageValidate', imagineImageValidate)
    const imagineImageGateway = new StableDiffusionGatewayHttp()
    Registry.getInstance().provide('imagineImageGateway', imagineImageGateway)
    const imageRepository = new ImageRepositoryMongo()
    Registry.getInstance().provide('imageRepository', imageRepository)
    const imagineImage = new ImagineImage()
    Registry.getInstance().provide('imagineImage', imagineImage)
    new ImagineController()
  }
}
