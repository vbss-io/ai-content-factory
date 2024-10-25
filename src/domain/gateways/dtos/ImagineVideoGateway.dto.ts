export interface ImagineVideoInput {
  prompt: string
  width: number
  height: number
  imageUrl?: string
  loop?: boolean
  isAutomaticCall?: boolean
}

export interface ImagineVideoOutput {
  videos: string[]
  prompt: string
  model: string
  origin: string
  width: number
  height: number
  taskId: string
  errorMessage?: string
}
