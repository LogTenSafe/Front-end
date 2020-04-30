import Vue from 'vue'
import Vuex from 'vuex'

import { capitalize } from 'lodash-es'
import { AnyModuleState, RootState } from '@/store/types'
import root from '@/store/modules/root'
import session from '@/store/modules/session'
import backups from '@/store/modules/backups'
import { FROZEN_MODULES } from '@/store/utils'

Vue.use(Vuex)
const store = new Vuex.Store<RootState>({
  ...root,
  modules: { session, backups }
})

store.subscribe(() => {
  const frozenState: {[key: string]: AnyModuleState} = {}
  FROZEN_MODULES.forEach(mod => {
    const frozenMod = store.getters[`freeze${capitalize(mod)}`]
    if (frozenMod) frozenState[mod] = frozenMod
  })
  window.localStorage.setItem('store', JSON.stringify(frozenState))
})

export default store
