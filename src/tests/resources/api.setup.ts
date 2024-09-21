import { httpServer } from '@/main'
import { SuperTestAdapter } from '@/tests/resources/SupertestAdapter'

const app: any = httpServer.start()
const supertest: SuperTestAdapter = new SuperTestAdapter(app)

export { app, supertest }
