export interface ImagineInput {
  prompt: string
  batch_size: number
  steps: number
  width: number
  height: number
  sampler_index: string
  scheduler: string
  negative_prompt?: string
  seed?: number
  isAutomaticCall?: boolean
}

export interface ImagineOutput {
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
