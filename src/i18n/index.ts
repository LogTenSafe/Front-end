import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@/i18n/messages'
import numberFormats from '@/i18n/numberFormats'

Vue.use(VueI18n)

const debug = process.env.NODE_ENV !== 'production'

const i18n = new VueI18n({
  locale: navigator.language,
  fallbackLocale: 'en',
  messages,
  numberFormats,
  silentFallbackWarn: true
})

if (debug && module.hot) {
  module.hot.accept(['./en'], async () => {
    const reloadedEn = await import('./en')
    i18n.setLocaleMessage('en', reloadedEn.default)
  })
}

export default i18n
