import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { CustomError } from '@api/infra/errors/CustomError'

export class PromptGenerationError extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'Error to generate prompt')
  }
}
