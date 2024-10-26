import 'dotenv/config'

import { app, supertest } from '@/prompt/tests/resources/api.setup'

afterAll(async () => {
  await app.close()
})

test('Deve ser possivel checar status da API Prompt', async () => {
  const { statusCode, body } = await supertest.get({ url: '/status' })
  expect(statusCode).toBe(200)
  expect(body).toStrictEqual({
    status: 'OK'
  })
})
