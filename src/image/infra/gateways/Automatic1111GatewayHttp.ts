import { type ImagineImageInput, type ImagineImageOutput } from '@/image/domain/gateways/dtos/ImagineImageGateway.dto'
import { type ImagineImageGateway } from '@/image/domain/gateways/ImagineImageGateway'
import { type HttpClient } from '@api/domain/http/HttpClient'
import { inject } from '@api/infra/dependency-injection/Registry'

export class Automatic1111GatewayHttp implements ImagineImageGateway {
  protected url = process.env.STABLE_DIFFUSION_URL
  protected baseConfig = {
    save_images: true
  }

  @inject('httpClient')
  private readonly httpClient!: HttpClient

  async imagine (input: ImagineImageInput): Promise<ImagineImageOutput> {
    const baseOutput = {
      images: [],
      prompt: input.prompt,
      negativePrompt: input.negative_prompt ?? 'none',
      seeds: [],
      width: input.width,
      height: input.height,
      sampler: input.sampler_index,
      scheduler: input.scheduler,
      steps: input.steps,
      model: 'none',
      origin: 'Automatic1111',
      taskId: 'none'
    }
    try {
      const response = await this.httpClient.post({
        url: `${this.url}/sdapi/v1/txt2img`,
        body: {
          ...this.baseConfig,
          ...input
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const info = JSON.parse(response.info as string)
      if (input.batch_size > 1) {
        response.images.shift()
      }
      return {
        ...baseOutput,
        images: response.images,
        seeds: info.all_seeds,
        sampler: info.sampler_name,
        scheduler: response.parameters.scheduler,
        model: info.sd_model_name
      }
    } catch (error: any) {
      return {
        ...baseOutput,
        errorMessage: error.message
      }
    }
  }
}
