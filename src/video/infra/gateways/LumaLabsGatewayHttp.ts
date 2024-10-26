import { AspectRatio } from '@/image/domain/vos/AspectRatio'
import { type ImagineVideoInput, type ImagineVideoOutput } from '@/video/domain/gateways/dtos/ImagineVideoGateway.dto'
import { type ImagineVideoGateway } from '@/video/domain/gateways/ImagineVideoGateway'
import { type HttpClient } from '@api/domain/http/HttpClient'
import { inject } from '@api/infra/dependency-injection/Registry'

export class LumaLabsGatewayHttp implements ImagineVideoGateway {
  protected DELAY = 120000
  protected MAX_TRIES = 10
  protected url = process.env.LUMALABS_URL
  protected key = process.env.LUMALABS_KEY
  protected baseConfig = {}

  @inject('httpClient')
  private readonly httpClient!: HttpClient

  async imagine (input: ImagineVideoInput): Promise<ImagineVideoOutput> {
    const baseOutput = {
      videos: [],
      prompt: input.prompt,
      width: input.width,
      height: input.height,
      model: 'LumaLabs',
      origin: 'Api LumaLabs',
      taskId: 'none'
    }
    try {
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
      baseOutput.taskId = taskId
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
    } catch (error: any) {
      return {
        ...baseOutput,
        errorMessage: error.message
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
