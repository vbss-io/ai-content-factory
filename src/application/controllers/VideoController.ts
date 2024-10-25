import { type DeleteVideoById } from '@/application/usecases/Video/DeleteVideoByIdInput'
import { type GetVideoById } from '@/application/usecases/Video/GetVideoById'
import { type GetVideoFilters } from '@/application/usecases/Video/GetVideoFilters'
import { type GetVideos } from '@/application/usecases/Video/GetVideos'
import { type LikeVideo } from '@/application/usecases/Video/LikeVideo'
import { type ProcessVideo } from '@/application/usecases/Video/ProcessVideo'
import { type RequestVideo } from '@/application/usecases/Video/RequestVideo'
import { type VideoRequestedData } from '@/domain/events/VideoRequested'
import { type HttpServer } from '@/domain/http/HttpServer'
import { HttpStatusCodes } from '@/domain/http/HttpStatusCodes'
import { type Queue } from '@/domain/queue/Queue'
import { type InputValidate } from '@/domain/validate/InputValidate'
import { inject } from '@/infra/dependency-injection/Registry'
import { type RequestFacade } from '@/infra/facades/RequestFacade'
import { type ByIdInput } from '@/infra/schemas/ByIdSchema'
import { type GetAllInput } from '@/infra/schemas/GetAllSchema'
import { type RequestVideoInput } from '@/infra/schemas/RequestVideoSchema'

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
      const inputParsed = this.requestVideoValidate.validate(params)
      return await this.requestVideo.execute(inputParsed)
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
