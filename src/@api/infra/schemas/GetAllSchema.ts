import { z } from 'zod'

export const GetAllSchema = z.object({
  search_mask: z.string({
    invalid_type_error: 'search_mask must be a string'
  }).optional(),
  sampler: z.string({
    invalid_type_error: 'sampler must be a string'
  }).optional(),
  scheduler: z.string({
    invalid_type_error: 'scheduler must be a string'
  }).optional(),
  status: z.string({
    invalid_type_error: 'status must be a string'
  }).optional(),
  origin: z.string({
    invalid_type_error: 'origin must be a string'
  }).optional(),
  modelName: z.string({
    invalid_type_error: 'modelName must be a string'
  }).optional(),
  aspectRatio: z.string({
    invalid_type_error: 'aspectRatio must be a string'
  }).optional(),
  page: z.number({
    invalid_type_error: 'page must be a number'
  }).default(1)
})

export type GetAllInput = z.infer<typeof GetAllSchema>
