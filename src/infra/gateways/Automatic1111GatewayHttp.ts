import { type ImagineInput, type ImagineOutput } from '@/domain/gateways/dto/ImagineImageGateway.dto'
import { type ImagineImageGateway } from '@/domain/gateways/ImagineImageGateway'
import { inject } from '@/infra/dependency-injection/Registry'
import { type HttpClient } from '@/infra/http/HttpClient'

export class Automatic1111GatewayHttp implements ImagineImageGateway {
  protected url = process.env.STABLE_DIFFUSION_URL
  protected baseConfig = {
    save_images: true
  }

  @inject('httpClient')
  private readonly httpClient!: HttpClient

  async imagine (input: ImagineInput): Promise<ImagineOutput> {
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
      images: response.images,
      prompt: info.prompt,
      negativePrompt: info.negative_prompt,
      seeds: info.all_seeds,
      width: info.width,
      height: info.height,
      sampler: info.sampler_name,
      scheduler: response.parameters.scheduler,
      steps: info.steps,
      model: info.sd_model_name,
      origin: 'Automatic1111',
      taskId: 'none'
    }
  }
}
