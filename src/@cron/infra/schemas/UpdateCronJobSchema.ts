import { z } from 'zod'

export const UpdateCronJobSchema = z.object({
  id: z.string({
    required_error: 'id is required',
    invalid_type_error: 'id must be a string'
  }),
  cronTime: z.string({
    required_error: 'cronTime is required',
    invalid_type_error: 'cronTime must be a string like 0 */12 * * *'
  }).optional(),
  genImages: z.boolean({
    invalid_type_error: 'genImages must be a boolean'
  }).optional().default(false),
  genVideos: z.boolean({
    invalid_type_error: 'genVideos must be a boolean'
  }).optional().default(false),
  origins: z.array(z.string({
    required_error: 'origin value is required',
    invalid_type_error: 'origin value must be a string'
  }), {
    required_error: 'origins array is required',
    invalid_type_error: 'origin must be a array of string'
  }).optional(),
  customPrompt: z.string({
    invalid_type_error: 'customPrompt must be a string'
  }).optional(),
  customAspectRatio: z.string({
    invalid_type_error: 'customPrompt must be a string'
  }).optional()
})

export type UpdateCronJobInput = z.infer<typeof UpdateCronJobSchema>
