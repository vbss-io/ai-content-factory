import { type PromptOutput } from '@/domain/gateways/dto/PromptGateway.dto'

export interface PromptGateway {
  generatePrompt: (prompt: string) => Promise<PromptOutput>
}
