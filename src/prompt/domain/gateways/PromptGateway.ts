import { type PromptOutput } from '@/prompt/domain/gateways/dtos/PromptGateway.dto'

export interface PromptGateway {
  generatePrompt: (prompt: string) => Promise<PromptOutput>
}
