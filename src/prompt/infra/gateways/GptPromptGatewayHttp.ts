import { type PromptOutput } from '@/prompt/domain/gateways/dtos/PromptGateway.dto'
import { type PromptGateway } from '@/prompt/domain/gateways/PromptGateway'
import { PromptGenerationError } from '@/prompt/infra/errors/PromptErrorCatalog'
import { type HttpClient } from '@api/domain/http/HttpClient'
import { inject } from '@api/infra/dependency-injection/Registry'

export class GptGatewayHttp implements PromptGateway {
  protected url = process.env.OPENAI_URL
  protected config = {
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: 800,
    model: 'gpt-4o-mini'
  }

  @inject('httpClient')
  private readonly httpClient!: HttpClient

  async generatePrompt (prompt: string): Promise<PromptOutput> {
    const response = await this.httpClient.post({
      url: `${this.url}/v1/chat/completions`,
      body: {
        ...this.config,
        response_format: { type: 'json_object' },
        messages: [{
          role: 'system',
          content: [{
            type: 'text',
            text: prompt
          }]
        }]
      },
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    try {
      const message = response.choices[0].message.content as string
      return JSON.parse(message)
    } catch {
      throw new PromptGenerationError()
    }
  }
}
