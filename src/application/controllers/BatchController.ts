import { type DeleteBatchById } from '@/application/usecases/Batch/DeleteBatchById'
import { type GetBatchById } from '@/application/usecases/Batch/GetBatchById'
import { type GetBatches } from '@/application/usecases/Batch/GetBatches'
import { inject } from '@/infra/dependency-injection/Registry'
import type { HttpServer } from '@/infra/http/HttpServer'
import { HttpStatusCodes } from '@/infra/http/HttpStatusCodes'
import { type ByIdInput } from '@/infra/schemas/ByIdSchema'
import { type GetAllInput } from '@/infra/schemas/GetAllSchema'
import { type InputValidate } from '@/infra/validate/InputValidate'

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
  }
}
