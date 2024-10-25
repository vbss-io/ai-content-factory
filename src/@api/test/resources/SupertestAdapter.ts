import { type HttpClientGetInput, type HttpClientPostInput } from '@api/domain/http/dtos/HttpClient.dto'
import { type HttpClient } from '@api/domain/http/HttpClient'
import supertest from 'supertest'
import { type App } from 'supertest/types'

export class SuperTestAdapter implements HttpClient {
  httpServer: any

  constructor (expressServer: any) {
    this.httpServer = supertest(expressServer as App)
  }

  async get ({ url, params = {}, headers = {} }: HttpClientGetInput): Promise<any> {
    return this.httpServer.get(url).query(params).set({ ...headers })
  }

  async post ({ url, body, params = {}, headers = {} }: HttpClientPostInput): Promise<any> {
    return this.httpServer.post(url).send(body).query(params).set({ ...headers })
  }

  async put ({ url, body, params = {}, headers = {} }: HttpClientPostInput): Promise<any> {
    return this.httpServer.put(url).send(body).query(params).set({ ...headers })
  }

  async patch ({ url, body, params = {}, headers = {} }: HttpClientPostInput): Promise<any> {
    return this.httpServer.patch(url).send(body).query(params).set({ ...headers })
  }

  async delete ({ url, params = {}, headers = {} }: HttpClientGetInput): Promise<any> {
    return this.httpServer.delete(url).send({}).query(params).set(headers)
  }
}
