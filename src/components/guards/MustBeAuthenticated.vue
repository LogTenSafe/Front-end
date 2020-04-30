<template>
  <div>
    <p class="text-danger" v-if="!loggedIn">{{$t('mustBeLoggedIn')}}</p>
    <slot v-else />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Getter } from 'vuex-class'
  import { Watch } from 'vue-property-decorator'

  /**
   * Requires the user to be logged in before rendering its subview. Redirects to the home page if
   * the user isn't logged in.
   */

  @Component
  export default class MustBeAuthenticated extends Vue {
    @Getter loggedIn!: boolean

    mounted(): void {
      this.onLoggedInChanged()
    }

    @Watch('loggedIn')
    onLoggedInChanged(): void {
      if (!this.loggedIn) this.$router.push({ name: 'Home' })
    }
  }
</script>
