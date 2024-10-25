import { type HttpClientGetInput, type HttpClientPostInput } from '@api/domain/http/dtos/HttpClient.dto'

export interface HttpClient {
  get: ({ url, params, headers, responseType }: HttpClientGetInput) => Promise<any>
  post: ({ url, body, params, headers }: HttpClientPostInput) => Promise<any>
  put: ({ url, body, params, headers }: HttpClientPostInput) => Promise<any>
  patch: ({ url, body, params, headers }: HttpClientPostInput) => Promise<any>
  delete: ({ url, params, headers }: HttpClientGetInput) => Promise<any>
}
