import Vue from 'vue'
import {
  createLocalVue, mount, Stubs, ThisTypedMountOptions, VueClass, Wrapper
} from '@vue/test-utils'
import VueI18n from 'vue-i18n'
import Vuex, { ModuleTree, Store } from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import i18n from '@/i18n'
import '@/config/filters'
import { RootState } from '@/store/types'
import backups from '@/store/modules/backups'
import session from '@/store/modules/session'
import router from '@/router'
import root from '@/store/modules/root'

export function makeLocalVue(): typeof Vue {
  const localVue = createLocalVue()
  localVue.use(VueI18n)
  localVue.use(BootstrapVue)
  localVue.use(Vuex)
  return localVue
}

export function mountComponent<V extends Vue>(
  component: VueClass<V>,
  {
    props, mocks, store, useRouter, stubs
  }: {
    props?: { [key: string]: unknown };
    mocks?: Record<string, unknown>;
    store?: ModuleTree<RootState>;
    useRouter?: boolean;
    stubs?: Stubs;
  }
): Wrapper<V> {
  const localVue = makeLocalVue()
  if (useRouter) {
    localVue.use(VueRouter)
  }

  const mockStore = new Store<RootState>({ ...root, modules: store ?? { session, backups } })

  const options: ThisTypedMountOptions<V> = {
    localVue,
    propsData: props,
    i18n,
    store: mockStore,
    mocks,
    stubs
  }

  if (useRouter) options.router = router

  return mount(component, options)
}
