import { type RequestImageInput as RequestImageSchemaInput } from '@/image/infra/schemas/RequestImageSchema'

export type RequestImageInput = RequestImageSchemaInput & {
  author: string
  authorName: string
}

export interface RequestImageOutput {
  batchId: string
  batchStatus: string
}
