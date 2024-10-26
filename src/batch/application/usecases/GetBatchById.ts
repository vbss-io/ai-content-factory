import { type BatchRepository } from '@/batch/domain/repositories/BatchRepository'
import { BatchNotFoundError } from '@/batch/infra/errors/BatchErrorCatalog'
import { inject } from '@api/infra/dependency-injection/Registry'
import { type GetBatchByIdInput, type GetBatchByIdOutput } from './dtos/GetBatchById.dto'

export class GetBatchById {
  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  async execute ({ id }: GetBatchByIdInput): Promise<GetBatchByIdOutput> {
    const batch = await this.batchRepository.getBatchById(id)
    if (!batch) throw new BatchNotFoundError()
    return batch
  }
}
