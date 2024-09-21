export interface ImagineOutput {
  images: string[]
  prompt: string
  negativePrompt: string
  seed: number
  width: number
  height: number
  sampler: string
  scheduler: string
  steps: number
  model: string
  origin: string
  infotext: string
}
