import 'dotenv/config'

import { app, supertest } from '@/auth/tests/resources/api.setup'
import { databaseConnection } from '@/image/main'

afterAll(async () => {
  await databaseConnection.close()
  await app.close()
})

test('Deve ser possivel checar status da API Image', async () => {
  const { statusCode, body } = await supertest.get({ url: '/status' })
  expect(statusCode).toBe(200)
  expect(body).toStrictEqual({
    status: 'OK'
  })
})
