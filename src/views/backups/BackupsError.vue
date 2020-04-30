<template>
  <div>
    <p class="lead text-danger">{{$t('backups.error.lead')}}</p>
    <p>{{$t('backups.error.description')}}</p>
    <p v-if="backupsError"><small>{{$t('backups.error.details', [backupsError])}}</small></p>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Getter } from 'vuex-class'

  @Component
  export default class BackupsError extends Vue {
    @Getter backupsError!: string | null
  }
</script>
