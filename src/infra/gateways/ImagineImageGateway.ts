import { inject } from '@/infra/dependency-injection/Registry'
import { type ImagineOutput } from '@/infra/gateways/dto/ImagineImageGateway.dto'
import { type HttpClient } from '@/infra/http/HttpClient'
import { type ImagineImageInput } from '@/infra/schemas/ImagineImageSchema'

export interface ImagineImageGateway {
  imagine: (input: ImagineImageInput) => Promise<ImagineOutput>
}

export class StableDiffusionGatewayHttp implements ImagineImageGateway {
  protected url = process.env.IMAGINE_IMAGE_URL
  protected baseConfig = {}

  @inject('httpClient')
  private readonly httpClient!: HttpClient

  async imagine (input: ImagineImageInput): Promise<ImagineOutput> {
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
    return {
      images: response.images,
      prompt: info.prompt,
      negativePrompt: info.negative_prompt,
      seed: info.seed,
      width: info.width,
      height: info.height,
      sampler: info.sampler_name,
      scheduler: response.parameters.scheduler,
      steps: info.steps,
      model: info.sd_model_name,
      origin: 'Stable Diffusion',
      infotext: info.infotexts.join(' ')
    }
  }
}
