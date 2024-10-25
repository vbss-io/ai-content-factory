export interface Cron {
  start: () => Promise<void>
  run: () => any
}
