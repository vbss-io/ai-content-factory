import 'dotenv/config'

import { databaseConnection } from '@/user/main'
import { app, supertest } from '@/user/tests/resources/api.setup'

afterAll(async () => {
  await databaseConnection.close()
  await app.close()
})

test('Deve ser possivel checar status da API User', async () => {
  const { statusCode, body } = await supertest.get({ url: '/status' })
  expect(statusCode).toBe(200)
  expect(body).toStrictEqual({
    status: 'OK'
  })
})
