import { type ImagineImageInput, type ImagineImageOutput } from '@/image/domain/gateways/dtos/ImagineImageGateway.dto'
import { type ImagineImageGateway } from '@/image/domain/gateways/ImagineImageGateway'
import { type HttpClient } from '@api/domain/http/HttpClient'
import { inject } from '@api/infra/dependency-injection/Registry'

export class GoAPIMidjourneyGatewayHttp implements ImagineImageGateway {
  protected DELAY = 60000
  protected MAX_TRIES = 10
  protected url = process.env.MIDJOURNEY_URL

  @inject('httpClient')
  private readonly httpClient!: HttpClient

  mapAspectRatio = {
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1456, height: 816 },
    '9:16': { width: 816, height: 1456 },
    '4:3': { width: 1232, height: 928 },
    '3:4': { width: 928, height: 1232 },
    '21:9': { width: 1680, height: 720 },
    '9:21': { width: 720, height: 1680 }
  }

  async imagine (input: ImagineImageInput): Promise<ImagineImageOutput> {
    const aspectRatio = input.aspectRadio as keyof typeof this.mapAspectRatio
    const baseOutput = {
      images: [],
      prompt: input.prompt,
      negativePrompt: input.negative_prompt ?? 'none',
      seeds: [0, 0, 0, 0],
      width: this.mapAspectRatio[aspectRatio].width,
      height: this.mapAspectRatio[aspectRatio].height,
      sampler: 'none',
      scheduler: 'none',
      steps: 0,
      model: 'Midjourney',
      origin: 'GoApi.ai',
      taskId: 'none'
    }
    try {
      const request = await this.requestGenImage(input.prompt, input.aspectRadio)
      baseOutput.taskId = request.data.task_id
      if (request.data.error.message) {
        const errorMessage = `Midjourney Imagine Error: ${request.data.error.message}`
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
        if (statusRequest.data.status === 'completed') break
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
          const upscaleRequest = await this.requestUpscaleImage(baseOutput.taskId, imageIndex)
          if (upscaleRequest.data.error.message) {
            const errorMessage = `Midjourney Upscale Error: ${upscaleRequest.data.error.message}`
            return {
              ...baseOutput,
              errorMessage
            }
          }
          const upscaleTaskId = upscaleRequest.data.task_id as string
          let upscaleStatusRequest
          let tries = 0
          while (true) {
            await this.delay(this.DELAY)
            upscaleStatusRequest = await this.checkTaskStatus(upscaleTaskId)
            if (statusRequest.data.status === 'completed') break
            tries++
            if (tries > this.MAX_TRIES) {
              const errorMessage = 'Midjourney Imagine Error: Time out / Max tries'
              return {
                ...baseOutput,
                errorMessage
              }
            }
          }
          const image = await this.imageUrlToBase64(upscaleStatusRequest.data.output.image_url as string)
          images.push(image)
        }
      }
      return {
        ...baseOutput,
        images
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

  private async imageUrlToBase64 (imageUrl: string): Promise<string> {
    const arrayBuffer = await this.httpClient.get({
      url: imageUrl,
      responseType: 'arraybuffer'
    })
    const buffer = Buffer.from(arrayBuffer as string, 'binary').toString('base64')
    return buffer
  }

  private async requestGenImage (prompt: string, aspect_ratio: string): Promise<any> {
    return await this.httpClient.post({
      url: `${this.url}/api/v1/task`,
      body: {
        model: 'midjourney',
        task_type: 'imagine',
        input: {
          prompt,
          aspect_ratio,
          process_mode: 'relax'
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.MIDJOURNEY_KEY
      }
    })
  }

  private async requestUpscaleImage (taskId: string, imageIndex: string): Promise<any> {
    return await this.httpClient.post({
      url: `${this.url}/api/v1/task`,
      body: {
        model: 'midjourney',
        task_type: 'upscale',
        input: {
          origin_task_id: taskId,
          index: imageIndex
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.MIDJOURNEY_KEY
      }
    })
  }

  private async checkTaskStatus (taskId: string): Promise<any> {
    return await this.httpClient.get({
      url: `${this.url}/api/v1/task/${taskId}`,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.MIDJOURNEY_KEY
      }
    })
  }
}
