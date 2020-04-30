<template>
  <div>
    <h1 class="mb-5">{{$t('backups.title')}}</h1>

    <b-table
      :busy="backupsLoading"
      :current-page="backupsPage"
      :fields="tableFields"
      :items="tableData"
      data-cy="backupsTable"
      id="backups-table"
      stacked="sm">

      <template #table-busy>
        <div class="text-center my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>{{$t('backups.loading')}}</strong>
        </div>
      </template>

      <template #cell(date)="data">
        <p class="m-0">{{data.item.createdAt | datetime}}</p>
        <p class="m-0"><small>{{$t('backup.uploadedFrom', [data.item.hostname])}}</small></p>
      </template>

      <template #cell(totalHours)="data">
        <span data-cy="totalHours" v-if="data.item.hasTotalHours">
          {{data.item.totalHours | duration}}
        </span>
      </template>

      <template #cell(lastFlight)="data">
        <last-flight-cell :backup="data.item" />
      </template>

      <template #cell(actions)="data">
        <actions-cell :backup="data.item" />
      </template>
    </b-table>

    <b-pagination :per-page="perPage"
                  :total-rows="backupsCount"
                  aria-controls="backups-table"
                  v-if="showPagination"
                  v-model="page" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Action, Getter } from 'vuex-class'
  import { BvTableFieldArray } from 'bootstrap-vue'
  import { isNil, isNull } from 'lodash-es'
  import { Backup } from '@/types'
  import LastFlightCell from '@/views/backups/backupRow/LastFlightCell.vue'
  import ActionsCell from '@/views/backups/backupRow/ActionsCell.vue'

  @Component({
    components: { ActionsCell, LastFlightCell }
  })
  export default class BackupsTable extends Vue {
    @Getter backupsPage!: number

    @Getter backupsCount!: number

    @Getter backups!: Backup[]

    @Getter backupsLoading!: boolean

    @Action loadBackups!: (payload: { page?: number }) => Promise<boolean>

    perPage = 50

    get tableFields(): BvTableFieldArray {
      return [
        { key: 'date', label: <string> this.$t('backups.columns.date') },
        { key: 'totalHours', label: <string> this.$t('backups.columns.totalHours') },
        { key: 'lastFlight', label: <string> this.$t('backups.columns.lastFlight') },
        { key: 'actions', label: '' }
      ]
    }

    get tableData(): (Backup & { hasTotalHours: boolean })[] {
      return this.backups.map(backup => ({ ...backup, hasTotalHours: !isNull(backup.totalHours) }))
    }

    get page(): number {
      return this.backupsPage
    }

    set page(page: number) {
      if (isNil(page)) return
      if (page === this.backupsPage) return
      this.loadBackups({ page })
    }

    get showPagination(): boolean {
      if (isNil(this.backupsPage)) return false
      return this.backupsCount > this.perPage
    }
  }
</script>
