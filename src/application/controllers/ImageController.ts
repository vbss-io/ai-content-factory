import { type ProcessImage } from '@/application/usecases/ProcessImage'
import { type RequestImage } from '@/application/usecases/RequestImage'
import { type ImageRequestedData } from '@/domain/events/ImageRequested'
import { inject } from '@/infra/dependency-injection/Registry'
import type { HttpServer } from '@/infra/http/HttpServer'
import { HttpStatusCodes } from '@/infra/http/HttpStatusCodes'
import { type Queue } from '@/infra/queue/Queue'
import { type RequestImageInput } from '@/infra/schemas/RequestImageSchema'
import { type InputValidate } from '@/infra/validate/InputValidate'

export class ImageController {
  @inject('httpServer')
  private readonly httpServer!: HttpServer

  @inject('queue')
  private readonly queue!: Queue

  @inject('requestImageValidate')
  private readonly requestImageValidate!: InputValidate<RequestImageInput>

  @inject('requestImage')
  private readonly requestImage!: RequestImage

  @inject('processImage')
  private readonly processImage!: ProcessImage

  constructor () {
    this.httpServer.register('post', '/image/imagine', async (params: RequestImageInput) => {
      const inputParsed = this.requestImageValidate.validate(params)
      return await this.requestImage.execute(inputParsed)
    }, HttpStatusCodes.Created)

    void this.queue.consume('imageRequested.processImage', async (input: ImageRequestedData) => {
      await this.processImage.execute(input)
    })
  }
}
