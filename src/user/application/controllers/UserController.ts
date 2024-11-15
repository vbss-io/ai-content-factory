import { type RequestFacade } from '@/auth/infra/facades/RequestFacade'
import { type CreateManualBatchInput } from '@/batch/infra/schemas/CreateManualBatchSchema'
import { type RemoveAvatar } from '@/user/application/usecases/RemoveAvatar'
import { type UploadAvatar } from '@/user/application/usecases/UploadAvatar'
import { type UploadAvatarInput } from '@/user/infra/schemas/UploadAvatarSchema'
import { type HttpServer } from '@api/domain/http/HttpServer'
import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { type InputValidate } from '@api/domain/validate/InputValidate'
import { inject } from '@api/infra/dependency-injection/Registry'

export class UserController {
  @inject('httpServer')
  private readonly httpServer!: HttpServer

  @inject('requestFacade')
  private readonly requestFacade!: RequestFacade

  @inject('uploadAvatarValidate')
  private readonly uploadAvatarValidate!: InputValidate<UploadAvatarInput>

  @inject('uploadAvatar')
  private readonly uploadAvatar!: UploadAvatar

  @inject('removeAvatar')
  private readonly removeAvatar!: RemoveAvatar

  constructor () {
    this.httpServer.register('patch', '/user/avatar', async (params: CreateManualBatchInput) => {
      const user = this.requestFacade.getUser()
      const avatarFiles: File[] = params.files
      const inputParsed = this.uploadAvatarValidate.validate({ files: avatarFiles })
      return await this.uploadAvatar.execute({ ...inputParsed, userId: user?.id as string })
    }, HttpStatusCodes.OK)

    this.httpServer.register('delete', '/user/avatar', async () => {
      const user = this.requestFacade.getUser()
      await this.removeAvatar.execute({ userId: user?.id as string })
    }, HttpStatusCodes.OK)
  }
}
