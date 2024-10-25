export interface AuthHandler {
  handle: (req: any, res: any, next: any) => Promise<any>
}
