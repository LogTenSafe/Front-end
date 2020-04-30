<template>
  <div>
    <navbar />
    <b-container tag="main" class="pt-5">
      <router-view />
    </b-container>
    <footer-view />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import Footer from '@/components/layout/Footer.vue'
  import Navbar from '@/components/layout/Navbar.vue'

  /**
   * Container view for the LogTenSafe application. Yields rendering to Vue-Router.
   */

  @Component({
    components: { Navbar, FooterView: Footer }
  })
  export default class Layout extends Vue {}
</script>
