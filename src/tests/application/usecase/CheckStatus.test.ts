import 'dotenv/config'

import { CheckStatus } from '@/application/usecases/CheckStatus'

const checkStatus = new CheckStatus()

test('Deve ser possivel checar status', async function () {
  const output = await checkStatus.execute()
  expect(output).toStrictEqual({
    status: 'OK'
  })
})
