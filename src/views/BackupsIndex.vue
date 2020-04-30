<template>
  <must-be-authenticated>
    <div data-cy="backupsContainer">
      <backups-error v-if="backupsError" />
      <no-backups v-else-if="noBackups" />
      <backups-table v-else />
      <b-modal :title="$t('restoreInstructions.title')" id="restore-instructions" ok-only>
        <restore-instructions />
      </b-modal>
    </div>
  </must-be-authenticated>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Action, Getter } from 'vuex-class'
  import NoBackups from '@/views/backups/NoBackups.vue'
  import BackupsError from '@/views/backups/BackupsError.vue'
  import BackupsTable from '@/views/backups/BackupsTable.vue'
  import RestoreInstructions from '@/views/backups/RestoreInstructions.vue'
  import MustBeAuthenticated from '@/components/guards/MustBeAuthenticated.vue'

  /**
   * Top-level view for the logged-in home page, the list of the user's backups.
   */

  @Component({
    components: {
      MustBeAuthenticated,
      RestoreInstructions,
      BackupsTable,
      BackupsError,
      NoBackups
    }
  })
  export default class BackupsIndex extends Vue {
    @Getter backupsLoading!: boolean

    @Getter backupsError!: Error | null

    @Getter backupsCount!: number

    @Action loadBackups!: (payload: { page?: number }) => Promise<boolean>

    get noBackups(): boolean {
      return !this.backupsLoading && this.backupsCount === 0
    }

    mounted(): void {
      this.loadBackups({})
    }
  }
</script>
