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

  mapAspectRatio = {
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1360, height: 752 },
    '9:16': { width: 752, height: 1360 },
    '4:3': { width: 1168, height: 864 },
    '3:4': { width: 864, height: 1168 },
    '21:9': { width: 1552, height: 656 },
    '9:21': { width: 656, height: 1552 }
  }

  async imagine (input: ImagineVideoInput): Promise<ImagineVideoOutput> {
    const aspectRatio = input.aspectRatio as keyof typeof this.mapAspectRatio
    const baseOutput = {
      videos: [],
      prompt: input.prompt,
      width: this.mapAspectRatio[aspectRatio].width,
      height: this.mapAspectRatio[aspectRatio].height,
      model: 'LumaLabs',
      origin: 'Api LumaLabs',
      taskId: 'none'
    }
    try {
      const body = {
        ...this.baseConfig,
        prompt: input.prompt,
        aspect_ratio: input.aspectRatio,
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
      const request = await this.requestGenVideo(body)
      baseOutput.taskId = request.id
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
        statusRequest = await this.checkTaskStatus(baseOutput.taskId)
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

  private async requestGenVideo (body: any): Promise<any> {
    return await this.httpClient.post({
      url: `${this.url}/dream-machine/v1/generations`,
      body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.key}`
      }
    })
  }

  private async checkTaskStatus (taskId: string): Promise<any> {
    return await this.httpClient.get({
      url: `${this.url}/dream-machine/v1/generations/${taskId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.key}`
      }
    })
  }
}
