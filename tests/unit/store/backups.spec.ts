import Vuex, { Store } from 'vuex'
import { expect } from 'chai'
import { createLocalVue } from '@vue/test-utils'
import { backupsJSON, default as allBackups } from '../../fixtures/allBackups'
import { mockServer } from '../setup'
import backups from '@/store/modules/backups'
import { RootState } from '@/store/types'
import root from '@/store/modules/root'
import session from '@/store/modules/session'

describe('Vuex: backups', () => {
  let store: Store<RootState>

  beforeEach(async () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Vuex.Store<RootState>({
      ...root,
      modules: { session, backups }
    })
  })

  describe('loadBackups', () => {
    it('loads the first page of backups', async () => {
      await mockServer.get('/backups.json').thenReply(200, JSON.stringify(backupsJSON))
      expect(await store.dispatch('loadBackups', {})).to.be.true

      expect(store.getters.backups).to.eql(allBackups)
      expect(store.getters.backupsLoading).to.be.false
      expect(store.getters.backupsError).to.be.null
    })

    it('loads the next page of backups', async () => {
      await mockServer.get('/backups.json').thenReply(
        200,
        JSON.stringify(backupsJSON.slice(0, 10)),
        { 'X-Next-Page': '/backups.json?page=2' }
      )
      await mockServer.get('/backups.json').withQuery({ page: 2 }).thenReply(
        200,
        JSON.stringify(backupsJSON.slice(10, 20))
      )

      expect(await store.dispatch('loadBackups', { page: 2 })).to.be.true
      expect(store.getters.backups).to.eql(allBackups.slice(0, 10))
    })

    it('handles an HTTP error', async () => {
      await mockServer.get('/backups.json').thenReply(404)
      expect(store.dispatch('loadBackups', { restart: false }))
        .to.eventually.throw('HTTP error: Not Found').then(() => {
          expect(store.getters.backupsError).to.eql('HTTP error: Not Found')
        })
    })
  })
})
