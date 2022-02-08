/* eslint-disable no-shadow */

import {
  ActionTree, Dispatch, GetterTree, Module, MutationTree
} from 'vuex'
import {
  assign, clone, concat, isNil, isNull, some
} from 'lodash-es'
import * as ActionCable from 'actioncable'
import { Backup, backupFromJSON, BackupJSON } from '@/types'
import { BackupsState, RootState } from '@/store/types'

let backupsSubscription: ActionCable.Channel | null = null

function createBackupsSubscription(consumer: ActionCable.Cable, dispatch: Dispatch) {
  if (backupsSubscription) backupsSubscription.unsubscribe()
  backupsSubscription = consumer.subscriptions.create({
    channel: 'BackupsChannel'
  }, {
    received(backupJSON: string) {
      dispatch('backupsSubscriptionMessage', { backupJSON: JSON.parse(backupJSON) })
    }
  })
}

export function state(): BackupsState {
  return {
    backups: null,
    backupsLoading: false,
    backupsError: null,
    backupsPage: 1,
    backupsCount: 0
  }
}

const getters: GetterTree<BackupsState, RootState> = {

  /** @return The current user's Backups. */
  backups(state): Backup[] {
    return state.backupsLoading || isNull(state.backups)
      ? []
      : clone(state.backups).sort((a, b) => b.createdAt.diff(a.createdAt).as('seconds'))
  },

  /** @return Whether the Backup list is currently loading. */
  backupsLoading(state): boolean {
    return state.backupsLoading
  },

  /** @return Whether at least one page of Backups has been loaded. */
  backupsLoaded(state): boolean {
    return !isNull(state.backups)
  },

  /** @return Any error that occurred when loading the user's Backup list. */
  backupsError(state): string | null {
    return state.backupsError
  },

  /** @return The last loaded page of backups (1-based). */
  backupsPage(state): number {
    return state.backupsPage
  },

  /** @return The total number of backups across all pages. */
  backupsCount(state): number {
    return state.backupsCount
  }
}

const mutations: MutationTree<BackupsState> = {
  RESET_BACKUPS(state_) {
    assign(state_, state())
  },

  START_BACKUPS(state, { page }: { page: number }) {
    state.backupsLoading = true
    state.backupsError = null
    state.backupsPage = page
  },

  FINISH_BACKUPS(
    state,
    { backups, page, total }: { backups: Backup[], page: number, total: number }
  ) {
    state.backups = backups
    state.backupsPage = page
    state.backupsCount = total
    state.backupsLoading = false
  },

  BACKUPS_ERROR(state, { error }: { error: string }) {
    state.backups = []
    state.backupsLoading = false
    state.backupsError = error
  },

  DELETE_BACKUP(state, { id }: { id: number }) {
    if (isNull(state.backups)) return
    state.backups = state.backups.filter(b => b.id !== id)
  },

  UPDATE_BACKUPS_FROM_SUBSCRIPTION(
    state,
    { backupJSON }: { backupJSON: BackupJSON & { total: number } }
  ) {
    if (isNull(state.backups)) return

    if (backupJSON.destroyed) {
      state.backups = state.backups.filter(b => b.id !== backupJSON.id)
    } else if (some(state.backups, b => b.id === backupJSON.id)) {
      state.backups = [
        ...state.backups.filter(b => b.id !== backupJSON.id),
        backupFromJSON(backupJSON)
      ]
    } else {
      if (state.backupsPage !== 1) return
      // don't append new backups except on the first page
      state.backups = concat(state.backups, backupFromJSON(backupJSON))
    }

    state.backupsCount = backupJSON.total
  }
}

const actions: ActionTree<BackupsState, RootState> = {

  /**
   * Loads the list of Backups for the current user. Subsequent calls load the next page of Backups.
   *
   * @param page The page number to load (default 1).
   * @return `true` if more backups were loaded.
   */

  loadBackups(
    {
      commit, rootGetters, dispatch
    },
    { page }: { page?: number }
  ): Promise<boolean> {
    commit('START_BACKUPS', { page: page || 1 })

    return dispatch('requestJSON', {
      path: `/backups.json?page=${page || 1}`
    }).then(result => {
      if (result.ok) {
        if (isNil(result.val.body)) {
          const error = 'HTTP error: No response body'
          commit('BACKUPS_ERROR', { error })
          throw error
        } else {
          const backups = (<BackupJSON[]>result.val.body).map(object => backupFromJSON(object))

          const currentPage = result.val.response.headers.has('X-Page')
            ? Number.parseInt(result.val.response.headers.get('X-Page')!, 10) : 1
          const total = result.val.response.headers.has('X-Count')
            ? Number.parseInt(result.val.response.headers.get('X-Count')!, 10) : 1

          commit('FINISH_BACKUPS', {
            backups,
            total,
            page: currentPage
          })
          if (rootGetters.actionCableConsumer) {
            createBackupsSubscription(rootGetters.actionCableConsumer, dispatch)
          }
          return true
        }
      } else {
        const error = `HTTP error: ${result.val.response.statusText}`
        commit('BACKUPS_ERROR', { error })
        throw error
      }
    }).catch(error => {
      commit('BACKUPS_ERROR', { error })
      return Promise.reject(error)
    })
  },

  /**
   * Uploads a backup to the server, creating a new Backup record.
   *
   * @param body The request body.
   */

  addBackup({ dispatch }, { body }: { body: FormData }): Promise<void> {
    return dispatch('requestJSON', { path: '/backups.json', method: 'post', body }).then(result => {
      if (!result.ok) return Promise.reject(result.val)

      if (isNull(backupsSubscription)) dispatch('loadBackups', { page: 1 })
      return undefined
    })
  },

  /**
   * Deletes a Backup from the server.
   *
   * @param id The ID of the Backup to delete.
   */

  deleteBackup({ commit, dispatch }, { id }: { id: number }): Promise<void> {
    return dispatch('requestJSON', {
      path: `/backups/${id}.json`,
      method: 'delete'
    }).then(result => {
      if (result.ok) {
        commit('DELETE_BACKUP', { id })
        if (isNull(backupsSubscription)) dispatch('loadBackups', { page: 1 })
        return undefined
      }
      return Promise.reject(result.val)
    })
  },

  backupsSubscriptionMessage({ commit }, { backupJSON }: { backupJSON: string }) {
    commit('UPDATE_BACKUPS_FROM_SUBSCRIPTION', { backupJSON })
  }
}

const backups: Module<BackupsState, RootState> = {
  state,
  getters,
  mutations,
  actions
}
export default backups
