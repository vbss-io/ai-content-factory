import { inject } from '@/infra/dependency-injection/Registry'
import { AuthError, MissingAuthorizationToken } from '@/infra/error/ErrorCatalog'
import { type RequestFacade } from '@/infra/facade/RequestFacade'
import type { NextFunction, Request, Response } from 'express'
import { type TokenAuthentication } from './TokenAuthentication'

export interface AuthHandler {
  handle: (req: any, res: any, next: any) => Promise<any>
}

export class ExpressAuthHandler implements AuthHandler {
  protected byPassRoutes = [
    { method: 'GET', path: '/status' },
    { method: 'POST', path: '/sign_in' },
    { method: 'POST', path: '/login' },
    { method: 'GET', path: '/image' },
    { method: 'GET', path: '/images' },
    { method: 'GET', path: '/image/banner' },
    { method: 'GET', path: '/image/filters' },
    { method: 'GET', path: '/video' },
    { method: 'GET', path: '/videos' },
    { method: 'GET', path: '/video/filters' }
  ]

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
      // if (!role || role !== 'administrator') throw new NotAllowedError()
      this.requestFacade.setUser({ id, username, role })
    } catch (error: any) {
      throw new AuthError(error.message as string)
    }
    next()
  }
}
