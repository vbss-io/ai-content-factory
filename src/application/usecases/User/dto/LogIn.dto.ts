export interface LogInInput {
  username: string
  password: string
}

export interface LogInOutput {
  token: string
  username: string
  role: string
}
