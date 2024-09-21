import { z } from 'zod'

export const ImagineImageSchema = z.object({
  prompt: z.string({
    required_error: 'prompt is required',
    invalid_type_error: 'prompt must be a string'
  }),
  negative_prompt: z.string({
    invalid_type_error: 'negative_prompt must be a string'
  }).optional(),
  seed: z.number({
    invalid_type_error: 'negative_prompt must be a number'
  }).optional(),
  batch_size: z.number({
    invalid_type_error: 'batch_size must be a number'
  }).optional().default(1),
  steps: z.number({
    invalid_type_error: 'steps must be a number'
  }).optional().default(5),
  width: z.number({
    invalid_type_error: 'width must be a number'
  }).optional().default(512),
  height: z.number({
    invalid_type_error: 'height must be a number'
  }).optional().default(512),
  sampler_index: z.string({
    invalid_type_error: 'sampler_index must be a string'
  }).optional().default('DPM++ 2M'),
  scheduler: z.string({
    invalid_type_error: 'scheduler must be a string'
  }).optional().default('Karras'),
  save_images: z.boolean({
    invalid_type_error: 'save_images must be a boolean'
  }).optional().default(true),
  config: z.any().optional()
})

export type ImagineImageInput = z.infer<typeof ImagineImageSchema>
