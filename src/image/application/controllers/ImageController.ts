import { type RequestFacade } from '@/auth/infra/facades/RequestFacade'
import { type DeleteImageById } from '@/image/application/usecases/DeleteImageById'
import { type GetImageById } from '@/image/application/usecases/GetImageById'
import { type GetImageFilters } from '@/image/application/usecases/GetImageFilters'
import { type GetImages } from '@/image/application/usecases/GetImages'
import { type GetRandomLandscapeImage } from '@/image/application/usecases/GetRandomLandscapeImage'
import { type LikeImage } from '@/image/application/usecases/LikeImage'
import { type ProcessImage } from '@/image/application/usecases/ProcessImage'
import { type RequestImage } from '@/image/application/usecases/RequestImage'
import { type ImageRequestedData } from '@/image/domain/events/ImageRequested'
import { type RequestImageInput } from '@/image/infra/schemas/RequestImageSchema'
import { type HttpServer } from '@api/domain/http/HttpServer'
import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { type Queue } from '@api/domain/queue/Queue'
import { type InputValidate } from '@api/domain/validate/InputValidate'
import { inject } from '@api/infra/dependency-injection/Registry'
import { type ByIdInput } from '@api/infra/schemas/ByIdSchema'
import { type GetAllInput } from '@api/infra/schemas/GetAllSchema'

export class ImageController {
  @inject('httpServer')
  private readonly httpServer!: HttpServer

  @inject('requestFacade')
  private readonly requestFacade!: RequestFacade

  @inject('queue')
  private readonly queue!: Queue

  @inject('requestImageValidate')
  private readonly requestImageValidate!: InputValidate<RequestImageInput>

  @inject('requestImage')
  private readonly requestImage!: RequestImage

  @inject('byIdValidate')
  private readonly byIdValidate!: InputValidate<ByIdInput>

  @inject('getImageById')
  private readonly getImageById!: GetImageById

  @inject('deleteImageById')
  private readonly deleteImageById!: DeleteImageById

  @inject('getAllValidate')
  private readonly getAllValidate!: InputValidate<GetAllInput>

  @inject('getImages')
  private readonly getImages!: GetImages

  @inject('getRandomLandscapeImage')
  private readonly getRandomLandscapeImage!: GetRandomLandscapeImage

  @inject('processImage')
  private readonly processImage!: ProcessImage

  @inject('getImageFilters')
  private readonly getImageFilters!: GetImageFilters

  @inject('likeImage')
  private readonly likeImage!: LikeImage

  constructor () {
    this.httpServer.register('post', '/image', async (params: RequestImageInput) => {
      const inputParsed = this.requestImageValidate.validate(params)
      return await this.requestImage.execute(inputParsed)
    }, HttpStatusCodes.Created)

    this.httpServer.register('get', '/image', async (params: ByIdInput) => {
      const user = this.requestFacade.getUser()
      const inputParsed = this.byIdValidate.validate(params)
      return await this.getImageById.execute({ ...inputParsed, username: user?.username })
    }, HttpStatusCodes.OK)

    this.httpServer.register('delete', '/image', async (params: ByIdInput) => {
      const inputParsed = this.byIdValidate.validate(params)
      await this.deleteImageById.execute(inputParsed)
    }, HttpStatusCodes.OK)

    this.httpServer.register('get', '/images', async (params: GetAllInput) => {
      const page = Number(params?.page ?? 1)
      const inputParsed = this.getAllValidate.validate({ ...params, page })
      return await this.getImages.execute(inputParsed)
    }, HttpStatusCodes.OK)

    this.httpServer.register('get', '/image/banner', async () => {
      return await this.getRandomLandscapeImage.execute()
    }, HttpStatusCodes.OK)

    this.httpServer.register('get', '/image/filters', async () => {
      return await this.getImageFilters.execute()
    }, HttpStatusCodes.OK)

    this.httpServer.register('patch', '/image/like', async (params: ByIdInput) => {
      const user = this.requestFacade.getUser()
      const inputParsed = this.byIdValidate.validate(params)
      await this.likeImage.execute({ ...inputParsed, username: user?.username as string })
    }, HttpStatusCodes.OK)

    void this.queue.consume('imageRequested.processImage', async (input: ImageRequestedData) => {
      await this.processImage.execute(input)
    })
  }
}
