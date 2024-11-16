import { type ImagineImageInput, type ImagineImageOutput } from '@/image/domain/gateways/dtos/ImagineImageGateway.dto'
import { type ImagineImageGateway } from '@/image/domain/gateways/ImagineImageGateway'
import { type HttpClient } from '@api/domain/http/HttpClient'
import { inject } from '@api/infra/dependency-injection/Registry'

export class OpenAIDalle3GatewayHttp implements ImagineImageGateway {
  protected url = process.env.OPENAI_URL
  protected baseConfig = {
    model: 'dall-e-3'
  }

  @inject('httpClient')
  private readonly httpClient!: HttpClient

  mapAspectRatio = {
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1792, height: 1024 },
    '9:16': { width: 1024, height: 1792 }
  }

  async imagine (input: ImagineImageInput): Promise<ImagineImageOutput> {
    const aspectRatio = input.aspectRadio as keyof typeof this.mapAspectRatio
    const baseOutput = {
      images: [],
      prompt: input.prompt,
      negativePrompt: 'none',
      seeds: [],
      width: this.mapAspectRatio[aspectRatio].width,
      height: this.mapAspectRatio[aspectRatio].height,
      sampler: 'none',
      scheduler: 'none',
      steps: 0,
      model: 'DALL-E 3',
      origin: 'OpenAi',
      taskId: 'none'
    }
    try {
      const dimensions = `${this.mapAspectRatio[aspectRatio].width}x${this.mapAspectRatio[aspectRatio].height}`
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
      if (request.error) throw new Error(request.error.message as string)
      for (const image of request.data) {
        const imageBase64 = await this.imageUrlToBase64(image.url as string)
        images.push(imageBase64)
        seeds.push(0)
      }
      return {
        ...baseOutput,
        images,
        seeds
      }
    } catch (error: any) {
      return {
        ...baseOutput,
        errorMessage: error.message
      }
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
