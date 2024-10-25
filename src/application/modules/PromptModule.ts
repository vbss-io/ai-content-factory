import { Registry } from '@/infra/dependency-injection/Registry'
import { GptGatewayHttp } from '@/infra/gateways/prompt/GptPromptGatewayHttp'

export class PromptModule {
  constructor () {
    const promptGateway = new GptGatewayHttp()
    Registry.getInstance().provide('promptGateway', promptGateway)
  }
}
