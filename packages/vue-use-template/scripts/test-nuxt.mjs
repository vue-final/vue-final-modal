import { spawn } from 'node:child_process'
import process from 'node:process'
import { setTimeout as sleep } from 'node:timers/promises'
import cypress from 'cypress'

const baseUrl = 'http://127.0.0.1:3100'
const server = spawn(process.execPath, ['examples/nuxt/.output/server/index.mjs'], {
  env: { ...process.env, HOST: '127.0.0.1', PORT: '3100' },
  stdio: 'inherit',
})

try {
  await waitUntilServing(baseUrl)
  const result = await cypress.run({ testingType: 'e2e', config: { baseUrl } })
  process.exitCode = result.status === 'failed' || result.totalFailed > 0 ? 1 : 0
}
finally {
  server.kill()
}

async function waitUntilServing(url) {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await fetch(url).then(response => response.ok, () => false))
      return
    await sleep(500)
  }
  throw new Error(`The Nuxt example did not start serving at ${url}`)
}
