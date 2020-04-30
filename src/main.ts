// / <reference path="./shims-cypress.d.ts" />

import Vue from 'vue'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'
import InfiniteScroll from '@tygr/vue-infinite-scroll'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueRouter from 'vue-router'
import Layout from '@/views/Layout.vue'
import store from '@/store/index'
import secrets from '@/config/secrets'
import i18n from '@/i18n'
import '@/config/filters'

// import '@/assets/styles/bootstrap-dark.scss'
import '@/assets/styles/bootstrap.scss'
import '@/assets/styles/sticky-footer.scss'
import router from '@/router'

if (process.env.NODE_ENV === 'production') {
  Bugsnag.start({
    apiKey: secrets.bugsnagAPIKey,
    plugins: [new BugsnagPluginVue(Vue)]
  })

  Vue.config.productionTip = false
}

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)

Vue.component('infinite-scroll', InfiniteScroll)

document.addEventListener('DOMContentLoaded', () => {
  const vue = new Vue({
    render: create => create(Layout),
    router,
    store,
    i18n,
    beforeCreate() { this.$store.dispatch('initialize') }
  }).$mount('#app')

  if (window.Cypress) {
    // only available during E2E tests
    window.vue = vue
  }
})
