import Vuex, { Store } from 'vuex'
import { expect } from 'chai'
import { createLocalVue } from '@vue/test-utils'
import nock from 'nock'
import { backupsJSON, default as allBackups } from '../../fixtures/allBackups'
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
      const scope = nock('http://localhost:8080').
        get('/backups.json').
        query({ page: 1 }).
        reply(200, backupsJSON)

      expect(await store.dispatch('loadBackups', {})).to.be.true

      expect(store.getters.backups).to.eql(allBackups)
      expect(store.getters.backupsLoading).to.be.false
      expect(store.getters.backupsError).to.be.null
      expect(scope.isDone()).to.be.true
    })

    it('loads the next page of backups', async () => {
      const scope = nock('http://localhost:8080').
        get('/backups.json').
        query({ page: 2 }).
        reply(200, backupsJSON.slice(10, 20), {
          'X-Next-Page': '/backups.json?page=2'
        })

      expect(await store.dispatch('loadBackups', { page: 2 })).to.be.true
      expect(store.getters.backups).to.eql(allBackups.slice(10, 20))
      expect(scope.isDone()).to.be.true
    })

    it('handles an HTTP error', () => {
      const scope = nock('http://localhost:8080').
        get('/backups.json').
        query({ page: 1 }).
        reply(404, { error: 'not_found' })

      return expect(store.dispatch('loadBackups', { restart: false })).
        to.eventually.be.rejectedWith('not_found').
        then(() => {
          expect(store.getters.backupsError.toString()).to.eql('Error: not_found')
          expect(scope.isDone()).to.be.true
        })
    })
  })
})
