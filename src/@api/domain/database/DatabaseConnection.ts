export interface DatabaseConnection {
  connect: () => Promise<void>
  close: () => Promise<void>
}
