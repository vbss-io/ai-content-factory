import { type HttpClient } from '@/@api/domain/http/HttpClient'
import { inject } from '@/@api/infra/dependency-injection/Registry'
import { type ImagineVideoInput, type ImagineVideoOutput } from '@/domain/gateways/dtos/ImagineVideoGateway.dto'
import { type ImagineVideoGateway } from '@/domain/gateways/ImagineVideoGateway'
import { AspectRatio } from '@/domain/vos/AspectRatio'

export class LumaLabsGatewayHttp implements ImagineVideoGateway {
  protected DELAY = 120000
  protected MAX_TRIES = 10
  protected url = process.env.LUMALABS_URL
  protected key = process.env.LUMALABS_KEY
  protected baseConfig = {}

  @inject('httpClient')
  private readonly httpClient!: HttpClient

  async imagine (input: ImagineVideoInput): Promise<ImagineVideoOutput> {
    const aspectRatio = new AspectRatio(input.width, input.height)
    const body = {
      ...this.baseConfig,
      prompt: input.prompt,
      aspect_ratio: aspectRatio.getValue(),
      loop: input.loop ?? false
    }
    if (input.imageUrl) {
      Object.assign(body, {
        keyframes: {
          frame0: {
            type: 'image',
            url: input.imageUrl
          }
        }
      })
    }
    const request = await this.httpClient.post({
      url: `${this.url}/dream-machine/v1/generations`,
      body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.key}`
      }
    })
    const taskId = request.id
    const baseOutput = {
      videos: [],
      prompt: input.prompt,
      width: input.width,
      height: input.height,
      model: 'LumaLabs',
      origin: 'Api LumaLabs',
      taskId
    }
    if (request.state !== 'queued' || request.failure_reason) {
      const errorMessage = `LumaLabs Imagine Error: ${request.failure_reason}`
      return {
        ...baseOutput,
        errorMessage
      }
    }
    let statusRequest
    let tries = 0
    while (true) {
      await this.delay(this.DELAY)
      statusRequest = await this.httpClient.get({
        url: `${this.url}/dream-machine/v1/generations/${taskId}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.key}`
        }
      })
      console.log('statusRequest', statusRequest)
      if (statusRequest.state === 'completed') {
        const video = await this.videoUrlToBase64(statusRequest.assets.video as string)
        return {
          ...baseOutput,
          videos: [video]
        }
      }
      tries++
      if (tries > this.MAX_TRIES) {
        const errorMessage = 'LumaLabs Imagine Error: Time out / Max tries'
        return {
          ...baseOutput,
          errorMessage
        }
      }
    }
  }

  private async delay (ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async videoUrlToBase64 (videoUrl: string): Promise<string> {
    const arrayBuffer = await this.httpClient.get({
      url: videoUrl,
      responseType: 'arraybuffer'
    })
    const buffer = Buffer.from(arrayBuffer as string, 'binary').toString('base64')
    return buffer
  }
}
