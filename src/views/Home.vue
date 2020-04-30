<template>
  <must-be-unauthenticated>
    <div>
      <jumbo />

      <narrow>
        <h4>{{$t('home.alreadyHaveAccount')}}</h4>
        <login-form />
      </narrow>

      <migrate-warning />
    </div>
  </must-be-unauthenticated>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import LoginForm from '@/views/home/LoginForm.vue'
  import Narrow from '@/components/common/Narrow.vue'
  import MustBeUnauthenticated from '@/components/guards/MustBeUnauthenticated.vue'
  import MigrateWarning from '@/views/home/MigrateWarning.vue'
  import Jumbo from '@/views/home/Jumbo.vue'

  /**
   * Top-level view for the logged-out home page, with a login form.
   */

  @Component({
    components: {
 Jumbo, MigrateWarning, MustBeUnauthenticated, Narrow, LoginForm
}
  })
  export default class Home extends Vue {
  }
</script>
