export interface ImagineImageInput {
  prompt: string
  batch_size: number
  steps: number
  aspectRadio: string
  sampler_index: string
  scheduler: string
  negative_prompt?: string
  seed?: number
  isAutomaticCall?: boolean
}

export interface ImagineImageOutput {
  images: string[]
  prompt: string
  negativePrompt: string
  sampler: string
  scheduler: string
  steps: number
  model: string
  origin: string
  seeds: number[]
  width: number
  height: number
  taskId: string
  errorMessage?: string
}
