export interface ErrorHandler {
  handle: (err: Error, req: any, res: any, next: any) => any
}
