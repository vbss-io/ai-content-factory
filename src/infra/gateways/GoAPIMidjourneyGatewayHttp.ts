import { AspectRatio } from '@/domain/entities/vo/AspectRatio'
import { type ImagineInput, type ImagineOutput } from '@/domain/gateways/dto/ImagineImageGateway.dto'
import { type ImagineImageGateway } from '@/domain/gateways/ImagineImageGateway'
import { inject } from '@/infra/dependency-injection/Registry'
import { type HttpClient } from '@/infra/http/HttpClient'

export class GoAPIMidjourneyGatewayHttp implements ImagineImageGateway {
  protected DELAY = 120000
  protected MAX_TRIES = 10
  protected url = process.env.MIDJOURNEY_URL
  protected baseConfig = {
    process_mode: 'relax'
  }

  @inject('httpClient')
  private readonly httpClient!: HttpClient

  async imagine (input: ImagineInput): Promise<ImagineOutput> {
    const aspectRatio = new AspectRatio(input.width, input.height)
    const request = await this.httpClient.post({
      url: `${this.url}/mj/v2/imagine`,
      body: {
        ...this.baseConfig,
        ...input,
        aspect_ratio: aspectRatio.getValue()
      },
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.MIDJOURNEY_KEY
      }
    })
    const baseOutput = {
      images: [],
      prompt: input.prompt,
      negativePrompt: input.negative_prompt ?? 'none',
      seeds: [],
      width: input.width,
      height: input.height,
      sampler: 'none',
      scheduler: 'none',
      steps: 0,
      model: 'Midjourney',
      origin: 'GoApi.ai',
      taskId: request.task_id
    }
    if (request.status !== 'success') {
      const errorMessage = `Midjourney Imagine Error: ${request.message}`
      return {
        ...baseOutput,
        errorMessage
      }
    }
    const taskId = request.task_id
    let statusRequest
    let tries = 0
    while (true) {
      await this.delay(this.DELAY)
      statusRequest = await this.httpClient.post({
        url: `${this.url}/mj/v2/fetch`,
        body: {
          task_id: taskId
        },
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.MIDJOURNEY_KEY
        }
      })
      if (statusRequest.status === 'finished') break
      tries++
      if (tries > this.MAX_TRIES) {
        const errorMessage = 'Midjourney Imagine Error: Time out / Max tries'
        return {
          ...baseOutput,
          errorMessage
        }
      }
    }
    const imageIndexes = ['1', '2', '3', '4']
    const images = []
    for (const imageIndex of imageIndexes) {
      const processAll = input.isAutomaticCall ? true : imageIndex === '1'
      if (processAll) {
        const upscaleRequest = await this.httpClient.post({
          url: `${this.url}/mj/v2/upscale`,
          body: {
            origin_task_id: taskId,
            index: imageIndex
          },
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.MIDJOURNEY_KEY
          }
        })
        if (upscaleRequest.status !== 'success') {
          const errorMessage = `Midjourney Upscale Error: ${upscaleRequest.message}`
          return {
            ...baseOutput,
            errorMessage
          }
        }
        const upscaleTaskId = upscaleRequest.task_id
        let upscaleStatusRequest
        let tries = 0
        while (true) {
          await this.delay(this.DELAY)
          upscaleStatusRequest = await this.httpClient.post({
            url: `${this.url}/mj/v2/fetch`,
            body: {
              task_id: upscaleTaskId
            },
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.MIDJOURNEY_KEY
            }
          })
          if (upscaleStatusRequest.status === 'finished') break
          tries++
          if (tries > this.MAX_TRIES) {
            const errorMessage = 'Midjourney Imagine Error: Time out / Max tries'
            return {
              ...baseOutput,
              errorMessage
            }
          }
        }
        const image = await this.imageUrlToBase64(upscaleStatusRequest.task_result.image_url as string)
        images.push(image)
      }
    }
    return {
      images,
      prompt: input.prompt,
      negativePrompt: input.negative_prompt ?? 'none',
      seeds: [0, 0, 0, 0],
      width: input.width,
      height: input.height,
      sampler: 'none',
      scheduler: 'none',
      steps: 0,
      model: 'Midjourney',
      origin: 'GoApi.ai',
      taskId: 'any'
    }
  }

  private async delay (ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
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
