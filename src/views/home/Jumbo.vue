<template>
  <b-jumbotron :header="$t('home.jumbotron.header')"
               :lead="$t('home.jumbotron.lead')"
               header-level="5">
    <b-button :to="{ name: 'SignUp' }" data-cy="getStarted" size="lg" variant="primary">
      {{$t('home.getStartedButton')}}
    </b-button>
  </b-jumbotron>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  @Component
  export default class Jumbo extends Vue {
  }
</script>
