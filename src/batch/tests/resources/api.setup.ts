import { httpServer } from '@/batch/main'
import { SuperTestAdapter } from '@api/tests/resources/SupertestAdapter'

const app: any = httpServer.start()
const supertest: SuperTestAdapter = new SuperTestAdapter(app)

export { app, supertest }
