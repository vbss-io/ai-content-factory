import 'dotenv/config'

import { app, supertest } from '@/tests/resources/api.setup'

afterAll(async () => {
  app.close()
})

test('Deve ser possivel checar status da API', async () => {
  const { statusCode, body } = await supertest.get({ url: '/status' })
  expect(statusCode).toBe(200)
  expect(body).toStrictEqual({
    status: 'OK'
  })
})
