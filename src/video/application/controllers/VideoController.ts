import { type RequestFacade } from '@/auth/infra/facades/RequestFacade'
import { type DeleteVideoById } from '@/video/application/usecases/DeleteVideoByIdInput'
import { type GetVideoById } from '@/video/application/usecases/GetVideoById'
import { type GetVideoFilters } from '@/video/application/usecases/GetVideoFilters'
import { type GetVideos } from '@/video/application/usecases/GetVideos'
import { type LikeVideo } from '@/video/application/usecases/LikeVideo'
import { type ProcessVideo } from '@/video/application/usecases/ProcessVideo'
import { type RequestVideo } from '@/video/application/usecases/RequestVideo'
import { type VideoRequestedData } from '@/video/domain/events/VideoRequested'
import { type RequestVideoInput } from '@/video/infra/schemas/RequestVideoSchema'
import { type HttpServer } from '@api/domain/http/HttpServer'
import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { type Queue } from '@api/domain/queue/Queue'
import { type InputValidate } from '@api/domain/validate/InputValidate'
import { inject } from '@api/infra/dependency-injection/Registry'
import { type ByIdInput } from '@api/infra/schemas/ByIdSchema'
import { type GetAllInput } from '@api/infra/schemas/GetAllSchema'

export class VideoController {
  @inject('httpServer')
  private readonly httpServer!: HttpServer

  @inject('requestFacade')
  private readonly requestFacade!: RequestFacade

  @inject('queue')
  private readonly queue!: Queue

  @inject('requestVideoValidate')
  private readonly requestVideoValidate!: InputValidate<RequestVideoInput>

  @inject('requestVideo')
  private readonly requestVideo!: RequestVideo

  @inject('byIdValidate')
  private readonly byIdValidate!: InputValidate<ByIdInput>

  @inject('getVideoById')
  private readonly getVideoById!: GetVideoById

  @inject('deleteVideoById')
  private readonly deleteVideoById!: DeleteVideoById

  @inject('getAllValidate')
  private readonly getAllValidate!: InputValidate<GetAllInput>

  @inject('getVideos')
  private readonly getVideos!: GetVideos

  @inject('processVideo')
  private readonly processVideo!: ProcessVideo

  @inject('getVideoFilters')
  private readonly getVideoFilters!: GetVideoFilters

  @inject('likeVideo')
  private readonly likeVideo!: LikeVideo

  constructor () {
    this.httpServer.register('post', '/video', async (params: RequestVideoInput) => {
      const user = this.requestFacade.getUser()
      const inputParsed = this.requestVideoValidate.validate(params)
      return await this.requestVideo.execute({ ...inputParsed, author: user?.id as string, authorName: user?.username as string })
    }, HttpStatusCodes.Created)

    this.httpServer.register('get', '/video', async (params: ByIdInput) => {
      const user = this.requestFacade.getUser()
      const inputParsed = this.byIdValidate.validate(params)
      return await this.getVideoById.execute({ ...inputParsed, username: user?.username })
    }, HttpStatusCodes.OK)

    this.httpServer.register('delete', '/video', async (params: ByIdInput) => {
      const inputParsed = this.byIdValidate.validate(params)
      await this.deleteVideoById.execute(inputParsed)
    }, HttpStatusCodes.OK)

    this.httpServer.register('get', '/videos', async (params: GetAllInput) => {
      const page = Number(params?.page ?? 1)
      const inputParsed = this.getAllValidate.validate({ ...params, page })
      return await this.getVideos.execute(inputParsed)
    }, HttpStatusCodes.OK)

    this.httpServer.register('get', '/video/filters', async () => {
      return await this.getVideoFilters.execute()
    }, HttpStatusCodes.OK)

    this.httpServer.register('patch', '/video/like', async (params: ByIdInput) => {
      const user = this.requestFacade.getUser()
      const inputParsed = this.byIdValidate.validate(params)
      await this.likeVideo.execute({ ...inputParsed, username: user?.username as string })
    }, HttpStatusCodes.OK)

    void this.queue.consume('videoRequested.processVideo', async (input: VideoRequestedData) => {
      await this.processVideo.execute(input)
    })
  }
}
