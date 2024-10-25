import { GptGatewayHttp } from '@/infra/gateways/prompt/GptPromptGatewayHttp'
import { Registry } from '@api/infra/dependency-injection/Registry'

export class PromptModule {
  constructor () {
    const promptGateway = new GptGatewayHttp()
    Registry.getInstance().provide('promptGateway', promptGateway)
  }
}
