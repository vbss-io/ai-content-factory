import axios from 'axios'

axios.defaults.validateStatus = function () {
  return true
}

export interface HttpClientGetInput {
  url: string
  params?: any
  headers?: any
}

export interface HttpClientPostInput {
  url: string
  body?: any
  params?: any
  headers?: any
}

export interface HttpClient {
  get: ({ url, params, headers }: HttpClientGetInput) => Promise<any>
  post: ({ url, body, params, headers }: HttpClientPostInput) => Promise<any>
  put: ({ url, body, params, headers }: HttpClientPostInput) => Promise<any>
  patch: ({ url, body, params, headers }: HttpClientPostInput) => Promise<any>
  delete: ({ url, params, headers }: HttpClientGetInput) => Promise<any>
}

export class AxiosAdapter implements HttpClient {
  async get ({ url, params = {}, headers = {} }: HttpClientGetInput): Promise<any> {
    const response = await axios.get(url, { params, headers })
    return response.data
  }

  async post ({ url, body = {}, params = {}, headers = {} }: HttpClientPostInput): Promise<any> {
    const response = await axios.post(url, body, { params, headers })
    return response.data
  }

  async put ({ url, body = {}, params = {}, headers = {} }: HttpClientPostInput): Promise<any> {
    const response = await axios.put(url, body, { params, headers })
    return response.data
  }

  async patch ({ url, body = {}, params = {}, headers = {} }: HttpClientPostInput): Promise<any> {
    const response = await axios.patch(url, body, { params, headers })
    return response.data
  }

  async delete ({ url, params = {}, headers = {} }: HttpClientGetInput): Promise<any> {
    const response = await axios.delete(url, { params, headers })
    return response.data
  }
}
