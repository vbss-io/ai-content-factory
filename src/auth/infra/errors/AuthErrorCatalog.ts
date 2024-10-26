import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { CustomError } from '@api/infra/errors/CustomError'

export class DifferentPasswordAndConfirmation extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'password and confirmPassword must be equals')
  }
}

export class UserAuthenticationError extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'wrong username or password')
  }
}

export class MissingAuthorizationToken extends CustomError {
  constructor () {
    super(HttpStatusCodes.Unauthorized, 'Missing Authorization Token')
  }
}

export class NotAllowedError extends CustomError {
  constructor () {
    super(HttpStatusCodes.Unauthorized, 'Not Allowed Error')
  }
}

export class AuthError extends CustomError {
  constructor (message: string) {
    super(HttpStatusCodes.Unauthorized, message)
  }
}

export class UserNotSet extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'Cannot access user')
  }
}
