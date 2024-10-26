import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { CustomError } from '@api/infra/errors/CustomError'

export class UserAlreadyExist extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'username already exists')
  }
}
