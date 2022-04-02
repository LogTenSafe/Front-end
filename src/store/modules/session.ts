/* eslint-disable no-shadow */

import {
  ActionContext, ActionTree, GetterTree, Module, MutationTree
} from 'vuex'
import { assign, isNull, omit } from 'lodash-es'
import queryString from 'query-string'
import * as ActionCable from 'actioncable'
import { Result } from 'ts-results'
import { Signup } from '@/types'
import secrets from '@/config/secrets'
import {
  APIResponse, Errors, RootState, SessionState
} from '@/store/types'
import {
  ignoreResponseBodyOrReturnError,
  ignoreResponseBodyOrReturnErrors,
  ignoreResponseBodyOrThrowError
} from '@/store/utils'

interface JWTPayload {
  iss: string;
  sub: string;
  aud: string;
  exp?: string | number;
  nbf?: string | number;
  iat: string | number;
  jti: string;

  e: string;
}

export function state(): SessionState {
  return {
    JWT: null
  }
}

const getters: GetterTree<SessionState, RootState> = {
  JWT(state): string | null {
    return state.JWT
  },

  JWTPayload(state): JWTPayload | null {
    return state.JWT ? JSON.parse(atob(state.JWT.split('.')[1])) : null
  },

  /** @return Whether a user is currently logged in. */

  loggedIn(state): boolean {
    return !isNull(state.JWT)
  },

  /** @return The email of the logged-in user, or `null` if no one is logged in. */

  currentEmail(state, getters): string | null {
    const payload: JWTPayload | null = getters.JWTPayload
    if (isNull(payload)) return null
    return payload.e
  },

  actionCableConsumer(state): ActionCable.Cable | null {
    if (isNull(state.JWT)) return null
    const URL = `${secrets.actionCableURL}?${queryString.stringify({ jwt: state.JWT })}`
    return ActionCable.createConsumer(URL)
  },

  authHeader(state): string | null {
    if (state.JWT) return `Bearer ${state.JWT}`
    return null
  },

  freezeSession(state): SessionState {
    return state
  }
}

const mutations: MutationTree<SessionState> = {
  INITIALIZE_SESSION(state, { storedState }: { storedState: SessionState }) {
    state.JWT = storedState.JWT
  },

  RESET_SESSION(state_) {
    assign(state_, state())
  },

  SET_JWT(state, { JWT }: { JWT: string | null }) {
    state.JWT = JWT
  }
}

const actions: ActionTree<SessionState, RootState> = {

  /**
   * Attempts to log in a user.
   *
   * @param login The credentials to use.
   * @return A result containing nothing if successful, or an error message if failed.
   */

  async logIn(
    { dispatch },
    { email, password, rememberMe }: { email: string; password: string; rememberMe: boolean }
  ): Promise<Result<void, string>> {
    const response = await dispatch('request', {
      path: '/login.json',
      method: 'post',
      body: { user: { email, password, remember_me: rememberMe } },
      skipResetAuth: true
    })

    const responseResult = await ignoreResponseBodyOrReturnError(response, [422, 401])
    if (responseResult.ok) await dispatch('setJWT', { response })
    return responseResult
  },

  /**
   * Signs up a new user.
   *
   * @param signup The new user information.
   * @return A result containing nothing if successful, or an errors object if failed.
   */

  signUp({ dispatch }, { signup }: { signup: Signup }): Promise<APIResponse<void>> {
    return dispatch('requestJSON', {
      path: '/signup.json',
      method: 'post',
      body: {
        user: {
          ...omit(signup, 'passwordConfirmation'),
          password_confirmation: signup.passwordConfirmation
        }
      }
    }).then(result => {
      if (result.ok) return dispatch('setJWT', { response: result.val.response }).then(() => result)
      return Promise.reject(result)
    })
  },

  setJWT({ commit }, { response }: { response: Response }): Promise<void> {
    return new Promise(resolve => {
      const authorization = response.headers.get('Authorization')
      if (authorization && authorization.match(/^Bearer /)) {
        commit('SET_JWT', { JWT: authorization.slice(7) })
      }
      resolve()
    })
  },

  /**
   * Logs out the current user.
   */

  async logout({ dispatch, commit }): Promise<void> {
    await dispatch('request', {
      path: '/logout.json',
      method: 'delete'
    })

    commit('SET_JWT', { JWT: null })
    commit('RESET_BACKUPS')
  },

  /**
   * Generates a reset-password email.
   *
   * @param email The user email address to send the reset-password link to.
   * @return A Result containing nothing if successful, or the validation errors if failed.
   */

  async forgotPassword(
    { dispatch }: ActionContext<RootState, RootState>,
    { email }: { email: string }
  ): Promise<Result<void, Errors>> {
    const response = await dispatch('request', {
      method: 'post',
      path: '/forgot_password.json',
      body: { user: { email } }
    })
    return ignoreResponseBodyOrReturnErrors(response)
  },

  /**
   * Resets a user's password using a token from a reset-password email.
   *
   * @param password The new user password.
   * @param confirmation The password confirmation.
   * @param token The token from the reset-password email.
   * @return A Result containing nothing if successful, or the validation errors if failed.
   */

  async resetPassword(
    { dispatch }: ActionContext<RootState, RootState>,
    { password, confirmation, token }: { password: string; confirmation: string; token: string }
  ): Promise<Result<void, Errors>> {
    const response = await dispatch('request', {
      method: 'PATCH',
      path: '/forgot_password.json',
      body: {
        user: {
          password,
          password_confirmation: confirmation,
          reset_password_token: token
        }
      }
    })
    return ignoreResponseBodyOrReturnErrors(response)
  },

  /**
   * Changes a user's password.
   *
   * @param oldPassword The old user password.
   * @param newPassword The new user password.
   * @param confirmation The password confirmation.
   * @return A Result containing nothing if successful, or the validation errors if failed.
   */

  async changePassword(
    { dispatch }: ActionContext<RootState, RootState>,
    { oldPassword, newPassword, confirmation }: {
      oldPassword: string;
      newPassword: string;
      confirmation: string;
    }
  ): Promise<Result<void, Errors>> {
    const response = await dispatch('request', {
      method: 'PATCH',
      path: '/password.json',
      body: {
        user: {
          current_password: oldPassword,
          password: newPassword,
          password_confirmation: confirmation
        }
      }
    })
    return ignoreResponseBodyOrReturnErrors(response)
  },

  /**
   * Deletes a user account.
   */

  async deleteAccount(
    { dispatch, commit }: ActionContext<RootState, RootState>
  ): Promise<void> {
    const result = await dispatch('request', {
      method: 'delete',
      path: '/user.json'
    })
    await ignoreResponseBodyOrThrowError(result)
    commit('RESET_SESSION')
  }
}

const session: Module<SessionState, RootState> = {
  state,
  getters,
  mutations,
  actions
}
export default session
