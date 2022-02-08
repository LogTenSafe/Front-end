/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function,
    mocha/no-top-level-hooks */

import 'cross-fetch/polyfill'
import chai from 'chai'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'
import Sinon, { SinonSandbox } from 'sinon'
import { getLocal } from 'mockttp'

chai.use(sinonChai)
chai.use(chaiAsPromised)

const localStorage = {
  length: 0,
  clear(): void {},
  getItem(key: string): string | null { return null },
  key(index: number): string | null { return null },
  removeItem(key: string): void {},
  setItem(key: string, value: string): void {}
}

let sandbox: SinonSandbox
export const mockServer = getLocal()
let serverRunning = false

beforeEach(async () => {
  sandbox = Sinon.createSandbox()
  sandbox.replaceGetter(window, 'localStorage', () => localStorage)

  if (serverRunning) await mockServer.stop()
  await mockServer.start(8080)
  serverRunning = true
})

afterEach(async () => {
  if (serverRunning) {
    sandbox.restore()
    await mockServer.stop()
    serverRunning = false
  }
})

export function getSandbox(): SinonSandbox { return sandbox }
