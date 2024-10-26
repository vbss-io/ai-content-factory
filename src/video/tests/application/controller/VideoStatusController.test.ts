import 'dotenv/config'

import { app, supertest } from '@/user/tests/resources/api.setup'
import { databaseConnection } from '@/video/main'

afterAll(async () => {
  await databaseConnection.close()
  await app.close()
})

test('Deve ser possivel checar status da API Video', async () => {
  const { statusCode, body } = await supertest.get({ url: '/status' })
  expect(statusCode).toBe(200)
  expect(body).toStrictEqual({
    status: 'OK'
  })
})
