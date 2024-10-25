import { type ImagineImageInput, type ImagineImageOutput } from '@/domain/gateways/dtos/ImagineImageGateway.dto'
import { type ImagineImageGateway } from '@/domain/gateways/ImagineImageGateway'
import { type HttpClient } from '@api/domain/http/HttpClient'
import { inject } from '@api/infra/dependency-injection/Registry'

export class OpenAIDalle3GatewayHttp implements ImagineImageGateway {
  protected url = process.env.OPENAI_URL
  protected baseConfig = {
    model: 'dall-e-3'
  }

  @inject('httpClient')
  private readonly httpClient!: HttpClient

  async imagine (input: ImagineImageInput): Promise<ImagineImageOutput> {
    const dimensions = `${input.width}x${input.height}`
    const request = await this.httpClient.post({
      url: `${this.url}/v1/images/generations`,
      body: {
        ...this.baseConfig,
        prompt: input.prompt,
        n: input.batch_size,
        size: dimensions
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_KEY}`
      }
    })
    const images = []
    const seeds = []
    for (const image of request.data) {
      const imageBase64 = await this.imageUrlToBase64(image.url as string)
      images.push(imageBase64)
      seeds.push(0)
    }
    return {
      images,
      prompt: input.prompt,
      negativePrompt: 'none',
      seeds,
      width: input.width,
      height: input.height,
      sampler: 'none',
      scheduler: 'none',
      steps: 0,
      model: 'DALL-E 3',
      origin: 'OpenAi',
      taskId: 'none'
    }
  }

  private async imageUrlToBase64 (imageUrl: string): Promise<string> {
    const arrayBuffer = await this.httpClient.get({
      url: imageUrl,
      responseType: 'arraybuffer'
    })
    const buffer = Buffer.from(arrayBuffer as string, 'binary').toString('base64')
    return buffer
  }
}
