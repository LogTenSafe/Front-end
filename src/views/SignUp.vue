<template>
  <must-be-unauthenticated>
    <b-container>
      <h1>{{$t('signup.header')}}</h1>
      <b-row>
        <b-col />
        <b-col cols="5">

          <signup-form />

          <p>
            <router-link :to="{ name: 'Home' }">{{$t('signup.haveAccount')}}</router-link>
          </p>
        </b-col>
        <b-col />
      </b-row>
    </b-container>
  </must-be-unauthenticated>
</template>

<script lang="ts">
  import Component, { mixins } from 'vue-class-component'
  import FormErrors from '@/mixins/FormErrors'
  import MustBeUnauthenticated from '@/components/guards/MustBeUnauthenticated.vue'
  import Form from '@/views/signUp/Form.vue'

  /**
   * Top-level view for the signup form.
   */

  @Component({
    components: { SignupForm: Form, MustBeUnauthenticated }
  })
  export default class SignUp extends mixins(FormErrors) {

  }
</script>

<style lang="scss" scoped>
  #signup-email {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    margin-bottom: -1px;
  }

  #signup-password {
    border-radius: 0;
    margin-bottom: -1px;
  }

  #signup-password-confirmation {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>
