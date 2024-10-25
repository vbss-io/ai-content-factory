export interface HttpClientGetInput {
  url: string
  params?: any
  headers?: any
  responseType?: string
}

export interface HttpClientPostInput {
  url: string
  body?: any
  params?: any
  headers?: any
}
