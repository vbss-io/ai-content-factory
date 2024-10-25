import { httpServer } from '@/main'
import { SuperTestAdapter } from '@api/test/resources/SupertestAdapter'

const app: any = httpServer.start()
const supertest: SuperTestAdapter = new SuperTestAdapter(app)

export { app, supertest }

