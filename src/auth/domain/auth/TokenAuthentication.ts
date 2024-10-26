export interface TokenAuthentication {
  encode: (input: object, secret: string) => string
  decode: (input: string, secret: string) => any
}
