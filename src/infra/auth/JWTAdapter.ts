import jwt from 'jsonwebtoken'

export interface TokenAuthentication {
  encode: (input: object, secret: string) => string
  decode: (input: string, secret: string) => any
}

export class JWTAdapter implements TokenAuthentication {
  encode (input: object, secret: string): string {
    return jwt.sign(input, secret, { expiresIn: '24h' })
  }

  decode (input: string, secret: string): any {
    return jwt.verify(input, secret)
  }
}
