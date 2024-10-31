export interface CreateManualBatchInput {
  prompt: string
  negative_prompt: string
  origin: string
  model_name: string
  sizes?: Record<string, {
    width: number
    height: number
  }>
  images?: Array<File & { originalname: string }>
  videos?: Array<File & { originalname: string }>
  author: string
  authorName: string
}

export interface CreateManualBatchOutput {
  batchId: string
  status: string
}
