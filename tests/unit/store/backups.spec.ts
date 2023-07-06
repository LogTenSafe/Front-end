import Vuex, { Store } from 'vuex'
import { expect } from 'chai'
import { createLocalVue } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { default as allBackups } from '../../fixtures/allBackups'
import backend from '../backend'
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
      expect(await store.dispatch('loadBackups', {})).to.be.true

      expect(store.getters.backups).to.eql(allBackups.slice(0, 10))
      expect(store.getters.backupsLoading).to.be.false
      expect(store.getters.backupsError).to.be.null
    })

    it('loads the next page of backups', async () => {
      expect(await store.dispatch('loadBackups', { page: 2 })).to.be.true
      expect(store.getters.backups).to.eql(allBackups.slice(10, 20))
    })

    it('handles an HTTP error', () => {
      backend.use(
        http.get('http://localhost:8080/backups.json', () => new Response(JSON.stringify({ error: 'not_found' }), { status: 404 }))
      )

      return expect(store.dispatch('loadBackups', { restart: false })).
        to.eventually.be.rejectedWith('not_found').
        then(() => {
          expect(store.getters.backupsError.toString()).to.eql('Error: not_found')
        })
    })
  })
})
