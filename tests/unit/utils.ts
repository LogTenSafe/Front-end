import Vue from 'vue'
import { createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex, { Store } from 'vuex'
import { cloneDeep } from 'lodash-es'
import VueI18n from 'vue-i18n'
import { RootState } from '@/store/types'
import root from '@/store/modules/root'
import session from '@/store/modules/session'
import backups from '@/store/modules/backups'

export function componentLocalVue(): typeof Vue {
  const vue = createLocalVue()
  vue.use(BootstrapVue)
  vue.use(VueI18n)
  return vue
}

export function createTestStore(): Store<RootState> {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  return new Store({
    ...cloneDeep(root),
    modules: {
      session: cloneDeep(session),
      backups: cloneDeep(backups)
    }
  })
}

export function logIn(store: Store<RootState>): void {
  store.commit('SET_JWT', {
    JWT: 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRpbUB0ZXN0LmNvbSIsInN1YiI6IjQzIiwic2NwIjoidXNlciIsImF1ZCI6bnVsbCwiaWF0IjoxNTkyMDg3ODQ5LCJleHAiOjE1OTIxNzQyNDksImp0aSI6IjE3MDVmYjIyLTMzZDUtNDJhMy1iNzdhLWNlMzUzYjZhMzljOSJ9.fake-signature'
  })
}
