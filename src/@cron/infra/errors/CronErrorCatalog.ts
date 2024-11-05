import { HttpStatusCodes } from '@api/domain/http/HttpStatusCodes'
import { CustomError } from '@api/infra/errors/CustomError'

export class CronNotFoundError extends CustomError {
  constructor () {
    super(HttpStatusCodes.NotFound, 'Cron Not Found')
  }
}

export class CronTaskNotFoundError extends CustomError {
  constructor () {
    super(HttpStatusCodes.NotFound, 'Cannot find task')
  }
}

export class StartCronError extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'Cron already running')
  }
}

export class StopCronError extends CustomError {
  constructor () {
    super(HttpStatusCodes.BadRequest, 'Cron already stopped')
  }
}
