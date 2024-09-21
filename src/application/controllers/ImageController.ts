import { type ImagineImage } from '@/application/usecases/ImagineImage'
import { inject } from '@/infra/dependency-injection/Registry'
import type { HttpServer } from '@/infra/http/HttpServer'
import { HttpStatusCodes } from '@/infra/http/HttpStatusCodes'
import { type ImagineImageInput } from '@/infra/schemas/ImagineImageSchema'
import { type InputValidate } from '@/infra/validate/InputValidate'

export class ImagineController {
  @inject('httpServer')
  private readonly httpServer!: HttpServer

  @inject('imagineImage')
  private readonly imagineImage!: ImagineImage

  @inject('imagineImageValidate')
  private readonly imagineImageValidate!: InputValidate<ImagineImageInput>

  constructor () {
    this.httpServer.register('post', '/image/imagine', async (params: ImagineImageInput) => {
      const inputParsed = this.imagineImageValidate.validate(params)
      return await this.imagineImage.execute(inputParsed)
    }, HttpStatusCodes.OK)
  }
}
