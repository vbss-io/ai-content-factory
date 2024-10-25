import { type PromptOutput } from '@/domain/gateways/dtos/PromptGateway.dto'

export interface PromptGateway {
  generatePrompt: (prompt: string) => Promise<PromptOutput>
}
