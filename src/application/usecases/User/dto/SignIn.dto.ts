export interface SignInInput {
  username: string
  password: string
  confirmPassword: string
}

export interface SignInOutput {
  token: string
  username: string
  role: string
}
