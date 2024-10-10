import { z } from 'zod'

export const GetAllSchema = z.object({
  search_mask: z.string({
    invalid_type_error: 'search_mask must be a string'
  }).optional(),
  page: z.number({
    invalid_type_error: 'page must be a number'
  }).default(1)
})

export type GetAllInput = z.infer<typeof GetAllSchema>
