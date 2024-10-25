import { type GetImageByIdInput, type GetImageByIdOutput } from '@/application/usecases/Image/dtos/GetImageById.dto'
import { type Batch } from '@/domain/entities/Batch'
import { type BatchRepository } from '@/domain/repositories/BatchRepository'
import { type ImageRepository } from '@/domain/repositories/ImageRepository'
import { type UserRepository } from '@/domain/repositories/UserRepository'
import { inject } from '@api/infra/dependency-injection/Registry'
import { ImageNotFoundError, UserAuthenticationError } from '@api/infra/errors/ErrorCatalog'

export class GetImageById {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('batchRepository')
  private readonly batchRepository!: BatchRepository

  @inject('userRepository')
  private readonly userRepository!: UserRepository

  async execute ({ id, username }: GetImageByIdInput): Promise<GetImageByIdOutput> {
    const image = await this.imageRepository.getImageById(id)
    if (!image) throw new ImageNotFoundError()
    let userLiked = false
    if (username) {
      const user = await this.userRepository.getUserByUsername(username)
      if (!user) throw new UserAuthenticationError()
      userLiked = user.imageLikes.includes(id)
    }
    const batch = await this.batchRepository.getBatchById(image.batchId) as Batch
    return {
      ...image,
      prompt: batch.prompt,
      negativePrompt: batch.negativePrompt,
      sampler: batch.sampler,
      scheduler: batch.scheduler,
      steps: batch.steps,
      origin: batch.origin,
      modelName: batch.modelName,
      userLiked
    }
  }
}
