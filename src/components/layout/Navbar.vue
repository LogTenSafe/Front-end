<template>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand :to="{name: 'Home'}">LogTenSafe</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse" />

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item :to="{name: 'DownloadClient'}">{{$t('navbar.downloadClient')}}</b-nav-item>
        <b-nav-item :to="{name: 'ChangePassword'}" data-cy="editUserLink" v-if="loggedIn">
          <strong>{{currentEmail}}</strong>
        </b-nav-item>
        <b-nav-item @click.prevent="logOut" data-cy="logOutLink" v-if="loggedIn">
          {{$t('navbar.logOut')}}
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Action, Getter } from 'vuex-class'
  import Footer from '@/components/layout/Footer.vue'

  @Component({
    components: { FooterView: Footer }
  })
  export default class Navbar extends Vue {
    @Getter loggedIn!: boolean

    @Getter currentEmail!: string | null

    @Action logout!: () => Promise<void>

    async logOut(): Promise<void> {
      await this.logout()
    }
  }
</script>

<style lang="scss" scoped>
  .navbar-brand {
    cursor: pointer;
  }
</style>
