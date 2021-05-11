<template>
  <div>
    <i18n class="m-0" path="backup.download" tag="p" v-if="backup.downloadURL && backup.logbook">
      <template #link>
        <a :href="backup.downloadURL"
           @click="onDownload"
           data-cy="downloadLink"
           download="LogTenCoreDataStore.sql">
          {{$t('backup.downloadLink')}}
        </a>
      </template>
      <template #size>{{backup.logbook.size | filesize}}</template>
    </i18n>

    <p class="m-0"><a @click.prevent="onDelete" class="text-danger" data-cy="deleteLink" href="#">
      {{$t('backup.deleteLink')}}
    </a></p>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import Bugsnag from '@bugsnag/js'
  import { Action } from 'vuex-class'
  import { isString } from 'lodash-es'
  import { Backup } from '@/types'

  @Component
  export default class ActionsCell extends Vue {
    @Prop({ type: Object, required: true }) backup!: Backup

    @Action deleteBackup!: ({ id }: { id: number }) => Promise<void>

    onDownload(): void {
      this.$bvModal.show('restore-instructions')
    }

    async onDelete(): Promise<void> {
      try {
        await this.deleteBackup({ id: this.backup.id })
      } catch (error: unknown) {
        if (error instanceof Error) {
          Bugsnag.notify(error)
          await this.$bvModal.msgBoxOk(<string> this.$t('backup.deleteFailed'), {
            bodyClass: 'text-danger',
            headerClass: 'text-danger'
          })
        } else if (isString(error)) {
          Bugsnag.notify(error)
          await this.$bvModal.msgBoxOk(<string> this.$t('backup.deleteFailed'), {
            bodyClass: 'text-danger',
            headerClass: 'text-danger'
          })
        } else {
          throw error
        }
      }
    }
  }
</script>
