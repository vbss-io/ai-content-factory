import { SuperTestAdapter } from '@/@api/test/resources/SupertestAdapter'
import { httpServer } from '@/main'

const app: any = httpServer.start()
const supertest: SuperTestAdapter = new SuperTestAdapter(app)

export { app, supertest }

