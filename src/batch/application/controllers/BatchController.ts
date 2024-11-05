import { type RequestFacade } from '@/auth/infra/facades/RequestFacade'
import { type CreateManualBatch } from '@/batch/application/usecases/CreateManualBatch'
import { type DeleteBatchById } from '@/batch/application/usecases/DeleteBatchById'
import { type GetBatchById } from '@/batch/application/usecases/GetBatchById'
import { type GetBatches } from '@/batch/application/usecases/GetBatches'
import { type GetBatchFilters } from '@/batch/application/usecases/GetBatchFilters'
import { type CreateManualBatchInput } from '@/batch/infra/schemas/CreateManualBatchSchema'
import { type HttpServer } from '@api/domain/http/HttpServer'
import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { type InputValidate } from '@api/domain/validate/InputValidate'
import { inject } from '@api/infra/dependency-injection/Registry'
import { type ByIdInput } from '@api/infra/schemas/ByIdSchema'
import { type GetAllInput } from '@api/infra/schemas/GetAllSchema'

export class BatchController {
  @inject('httpServer')
  private readonly httpServer!: HttpServer

  @inject('requestFacade')
  private readonly requestFacade!: RequestFacade

  @inject('byIdValidate')
  private readonly byIdValidate!: InputValidate<ByIdInput>

  @inject('getBatchById')
  private readonly getBatchById!: GetBatchById

  @inject('deleteBatchById')
  private readonly deleteBatchById!: DeleteBatchById

  @inject('getAllValidate')
  private readonly getAllValidate!: InputValidate<GetAllInput>

  @inject('getBatches')
  private readonly getBatches!: GetBatches

  @inject('getBatchFilters')
  private readonly getBatchFilters!: GetBatchFilters

  @inject('createManualBatchValidate')
  private readonly createManualBatchValidate!: InputValidate<CreateManualBatchInput>

  @inject('createManualBatch')
  private readonly createManualBatch!: CreateManualBatch

  constructor () {
    this.httpServer.register('post', '/batch', async (params: CreateManualBatchInput) => {
      const user = this.requestFacade.getUser()
      const images: File[] = params.files?.filter((file: any) => file?.mimetype.includes('image')) ?? []
      const videos: File[] = params.files?.filter((file: any) => file?.mimetype.includes('video')) ?? []
      const inputParsed = this.createManualBatchValidate.validate({ ...params, images, videos })
      const sizes = JSON.parse(params.sizes)
      return await this.createManualBatch.execute({ ...inputParsed, sizes, author: user?.id as string, authorName: user?.username as string })
    }, HttpStatusCodes.OK)

    this.httpServer.register('get', '/batch', async (params: ByIdInput) => {
      const user = this.requestFacade.getUser()
      const inputParsed = this.byIdValidate.validate(params)
      return await this.getBatchById.execute({ ...inputParsed, userId: user?.id as string })
    }, HttpStatusCodes.OK)

    this.httpServer.register('delete', '/batch', async (params: ByIdInput) => {
      const user = this.requestFacade.getUser()
      const inputParsed = this.byIdValidate.validate(params)
      await this.deleteBatchById.execute({ ...inputParsed, userId: user?.id as string })
    }, HttpStatusCodes.OK)

    this.httpServer.register('get', '/batches', async (params: GetAllInput) => {
      const user = this.requestFacade.getUser()
      const page = Number(params?.page ?? 1)
      const inputParsed = this.getAllValidate.validate({ ...params, page })
      return await this.getBatches.execute({ ...inputParsed, userId: user?.id as string })
    }, HttpStatusCodes.OK)

    this.httpServer.register('get', '/batch/filters', async () => {
      return await this.getBatchFilters.execute()
    }, HttpStatusCodes.OK)
  }
}
