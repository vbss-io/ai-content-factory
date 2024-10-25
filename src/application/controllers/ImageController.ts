import { type DeleteImageById } from '@/application/usecases/Image/DeleteImageById'
import { type GetImageById } from '@/application/usecases/Image/GetImageById'
import { type GetImageFilters } from '@/application/usecases/Image/GetImageFilters'
import { type GetImages } from '@/application/usecases/Image/GetImages'
import { type GetRandomLandscapeImage } from '@/application/usecases/Image/GetRandomLandscapeImage'
import { type LikeImage } from '@/application/usecases/Image/LikeImage'
import { type ProcessImage } from '@/application/usecases/Image/ProcessImage'
import { type RequestImage } from '@/application/usecases/Image/RequestImage'
import { type ImageRequestedData } from '@/domain/events/ImageRequested'
import { type RequestFacade } from '@/infra/facades/RequestFacade'
import { type ByIdInput } from '@/infra/schemas/ByIdSchema'
import { type GetAllInput } from '@/infra/schemas/GetAllSchema'
import { type RequestImageInput } from '@/infra/schemas/RequestImageSchema'
import { type HttpServer } from '@api/domain/http/HttpServer'
import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { type Queue } from '@api/domain/queue/Queue'
import { type InputValidate } from '@api/domain/validate/InputValidate'
import { inject } from '@api/infra/dependency-injection/Registry'

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
