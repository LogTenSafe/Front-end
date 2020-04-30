<template>
  <b-container fluid="sm">
    <b-row cols="12">
      <b-col cols="0" md="3">&nbsp;</b-col>
      <b-col cols="12" md="6">
        <slot />
      </b-col>
      <b-col cols="0" md="3">&nbsp;</b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  /** Applies Bootstrap styling to create a more narrow content area. */

  @Component
  export default class Narrow extends Vue {
  }
</script>
