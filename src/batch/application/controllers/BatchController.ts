import { type DeleteBatchById } from '@/batch/application/usecases/DeleteBatchById'
import { type GetBatchById } from '@/batch/application/usecases/GetBatchById'
import { type GetBatches } from '@/batch/application/usecases/GetBatches'
import { type GetBatchFilters } from '@/batch/application/usecases/GetBatchFilters'
import { type HttpServer } from '@api/domain/http/HttpServer'
import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { type InputValidate } from '@api/domain/validate/InputValidate'
import { inject } from '@api/infra/dependency-injection/Registry'
import { type ByIdInput } from '@api/infra/schemas/ByIdSchema'
import { type GetAllInput } from '@api/infra/schemas/GetAllSchema'

export class BatchController {
  @inject('httpServer')
  private readonly httpServer!: HttpServer

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

  constructor () {
    this.httpServer.register('get', '/batch', async (params: ByIdInput) => {
      const inputParsed = this.byIdValidate.validate(params)
      return await this.getBatchById.execute(inputParsed)
    }, HttpStatusCodes.OK)

    this.httpServer.register('delete', '/batch', async (params: ByIdInput) => {
      const inputParsed = this.byIdValidate.validate(params)
      await this.deleteBatchById.execute(inputParsed)
    }, HttpStatusCodes.OK)

    this.httpServer.register('get', '/batches', async (params: GetAllInput) => {
      const page = Number(params?.page ?? 1)
      const inputParsed = this.getAllValidate.validate({ ...params, page })
      return await this.getBatches.execute(inputParsed)
    }, HttpStatusCodes.OK)

    this.httpServer.register('get', '/batch/filters', async () => {
      return await this.getBatchFilters.execute()
    }, HttpStatusCodes.OK)
  }
}
