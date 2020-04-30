/* eslint-disable no-underscore-dangle */

import Vue from 'vue'
import { DateTime } from 'luxon'
import numeral from 'numeral'
import i18n from '@/i18n'

Vue.filter('filesize', (number: number) => numeral(number).format('0,0.0 b'))
Vue.filter('duration', (number: number) => i18n.t('filters.duration', [numeral(number).format('0,0.0')]))
Vue.filter('airport', (lid: string | null) => lid ?? i18n.t('filters.unknownAirport'))
Vue.filter('datetime', (date: DateTime) => date.toLocaleString(DateTime.DATETIME_SHORT))
Vue.filter('date', (date: DateTime) => date.toLocaleString(DateTime.DATE_SHORT))
