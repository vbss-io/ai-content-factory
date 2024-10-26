export interface HttpServer {
  register: (method: string, url: string, callback: any, code?: number) => void
  start: (port?: number) => any
}
