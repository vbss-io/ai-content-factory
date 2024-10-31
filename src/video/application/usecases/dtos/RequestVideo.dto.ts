import { type RequestVideoInput as RequestVideoSchemaInput } from '@/video/infra/schemas/RequestVideoSchema'

export type RequestVideoInput = RequestVideoSchemaInput & {
  author: string
  authorName: string
}

export interface RequestVideoOutput {
  batchId: string
  batchStatus: string
}
