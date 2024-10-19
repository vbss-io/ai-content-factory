import { inject } from '@/infra/dependency-injection/Registry'
import { AuthError, MissingAuthorizationToken, NotAllowedError } from '@/infra/error/ErrorCatalog'
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
    { method: 'GET', path: '/image/filters' }
  ]

  @inject('tokenAuthentication')
  private readonly tokenAuthentication!: TokenAuthentication

  async handle (req: Request, _res: Response, next: NextFunction): Promise<void> {
    const canByPass = this.byPassRoutes.find((route) => route.method === req.method && route.path === req.path)
    if (canByPass) { next(); return }
    const { authorization } = req.headers
    const token = authorization?.replace('Bearer ', '')
    if (!token) throw new MissingAuthorizationToken()
    try {
      const { role } = await this.tokenAuthentication.decode(token, process.env.SECRET_KEY as string)
      if (!role || role !== 'administrator') throw new NotAllowedError()
    } catch (error: any) {
      throw new AuthError(error.message as string)
    }
    next()
  }
}
