import { type AuthHandler } from '@/auth/domain/auth/AuthHandler'
import { type TokenAuthentication } from '@/auth/domain/auth/TokenAuthentication'
import { authByPassRoutes } from '@/auth/domain/constants/authBypassRoutes'
import { AuthError, MissingAuthorizationToken, NotAllowedError } from '@/auth/infra/errors/AuthErrorCatalog'
import { type RequestFacade } from '@/auth/infra/facades/RequestFacade'
import { inject } from '@api/infra/dependency-injection/Registry'
import type { NextFunction, Request, Response } from 'express'

export class ExpressAuthHandler implements AuthHandler {
  protected byPassRoutes = authByPassRoutes

  @inject('tokenAuthentication')
  private readonly tokenAuthentication!: TokenAuthentication

  @inject('requestFacade')
  private readonly requestFacade!: RequestFacade

  async handle (req: Request, _res: Response, next: NextFunction): Promise<void> {
    const canByPass = this.byPassRoutes.find((route) => route.method === req.method && route.path === req.path)
    const { authorization } = req.headers
    if (canByPass && !authorization) { next(); return }
    const token = authorization?.replace('Bearer ', '')
    if (!token) throw new MissingAuthorizationToken()
    try {
      const { id, username, role } = await this.tokenAuthentication.decode(token, process.env.SECRET_KEY as string)
      if (!role || role !== 'administrator') throw new NotAllowedError()
      this.requestFacade.setUser({ id, username, role })
    } catch (error: any) {
      throw new AuthError(error.message as string)
    }
    next()
  }
}
