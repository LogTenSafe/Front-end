import { ActionContext, createLogger, StoreOptions } from 'vuex'
import { has, isNull, isString } from 'lodash-es'
import { Err, Ok } from 'ts-results'
import { APIResponse, RootState } from '@/store/types'
import secrets from '@/config/secrets'
import { FROZEN_MODULES } from '@/store/utils'

const debug = process.env.NODE_ENV === 'development' && !navigator.userAgent.includes('Chrome')

const root: StoreOptions<RootState> = {
  actions: {
    initialize({ commit }: ActionContext<RootState, RootState>): void {
      const storedStateJSON = localStorage.getItem('store')
      if (!isNull(storedStateJSON)) {
        const storedState = JSON.parse(storedStateJSON)
        FROZEN_MODULES.forEach(mod => {
          if (has(storedState, mod)) {
            commit(`INITIALIZE_${mod.toUpperCase()}`, { storedState: storedState[mod] })
          }
        })
      }
    },

    reset({ commit }: ActionContext<RootState, RootState>): void {
      localStorage.removeItem('store')
      commit('RESET_BACKUPS')
      commit('RESET_SESSION')
    },

    request(
      { commit, getters }: ActionContext<RootState, RootState>,
      {
        method, path, body, skipResetAuth
      }: {
        method?: string;
        path: string;
        body?: Record<string, unknown> | FormData | string;
        skipResetAuth?: boolean;
      }
    ): Promise<Response> {
      return new Promise((resolve, reject) => {
        let serializedBody: FormData | string
        if (!(body instanceof FormData) && !isString(body)) serializedBody = JSON.stringify(body)
        else serializedBody = body

        const headers: Record<string, string> = {
          Accept: 'application/json',
          Authorization: getters.authHeader
        }
        if (!(body instanceof FormData) && !isString(body)) {
          headers['Content-Type'] = 'application/json'
        }

        fetch(secrets.APIURL + path, {
          method: (method || 'get'),
          body: serializedBody,
          headers
        }).then(response => {
          if (response.status === 401 && !skipResetAuth) {
            commit('RESET_SESSION')
            return
          }

          resolve(response)
        }).catch(error => reject(error))
      })
    },

    async requestJSON<T>(
      { dispatch }: ActionContext<RootState, RootState>,
      args: { method?: string; path: string; body?: Record<string, unknown> }
    ): Promise<APIResponse<T>> {
      const response = await dispatch('request', args)
      if (response.ok) {
        return new Ok({ response, body: await response.json() })
      }
      return new Err({ response, body: await response.json() })
    }
  },

  strict: debug,
  plugins: debug ? [createLogger()] : []
}
export default root
