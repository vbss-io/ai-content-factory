import { type GetBatchesInput, type GetBatchesOutput } from '@/application/usecases/dto/GetBatches.dto'
import { type BatchRepository } from '@/domain/repository/BatchRepository'
import { inject } from '@/infra/dependency-injection/Registry'

export class GetBatches {
  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  async execute ({ search_mask, page }: GetBatchesInput): Promise<GetBatchesOutput> {
    return await this.batchRepository.getBatches(page, search_mask)
  }
}
