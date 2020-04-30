<template>
  <div>
    <i18n class="m-0" path="backup.lastFlight" tag="p" v-if="backup.lastFlight">
      <template #date>
        <strong>{{backup.lastFlight.date | date}}</strong>
      </template>
      <template #hours>{{backup.lastFlight.duration | duration}}</template>
    </i18n>
    <p class="m-0" v-if="backup.lastFlight"><small>
      {{$t('backup.flight', [origin, destination])}}
    </small></p>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { Backup } from '@/types'

  @Component
  export default class LastFlightCell extends Vue {
    @Prop({ type: Object, required: true }) backup!: Backup

    get origin(): string {
      return this.backup.lastFlight?.origin ?? '???'
    }

    get destination(): string {
      return this.backup.lastFlight?.destination ?? '???'
    }
  }
</script>
