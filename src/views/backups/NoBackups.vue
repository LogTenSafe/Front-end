<template>
  <div>
    <p class="lead">{{$t('backups.none.lead')}}</p>
    <download-client />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import DownloadClient from '@/components/DownloadClient.vue'

  @Component({
    components: { DownloadClient }
  })
  export default class NoBackups extends Vue {}
</script>
