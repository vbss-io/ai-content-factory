import { type BatchRepository } from '@/domain/repositories/BatchRepository'
import { inject } from '@/infra/dependency-injection/Registry'
import { BatchNotFoundError } from '@/infra/errors/ErrorCatalog'
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
