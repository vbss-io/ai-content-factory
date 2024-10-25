import { type HttpClientGetInput, type HttpClientPostInput } from '@api/domain/http/dtos/HttpClient.dto'
import { type HttpClient } from '@api/domain/http/HttpClient'
import axios from 'axios'

axios.defaults.validateStatus = function () {
  return true
}

export class AxiosAdapter implements HttpClient {
  async get ({ url, params = {}, headers = {}, responseType }: HttpClientGetInput): Promise<any> {
    const options = { params, headers }
    if (responseType) Object.assign(options, { responseType })
    const response = await axios.get(url, options)
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
