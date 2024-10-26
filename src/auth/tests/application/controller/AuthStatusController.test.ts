import 'dotenv/config'

import { databaseConnection } from '@/auth/main'
import { app, supertest } from '@/auth/tests/resources/api.setup'

afterAll(async () => {
  await databaseConnection.close()
  await app.close()
})

test('Deve ser possivel checar status da API Auth', async () => {
  const { statusCode, body } = await supertest.get({ url: '/status' })
  expect(statusCode).toBe(200)
  expect(body).toStrictEqual({
    status: 'OK'
  })
})
