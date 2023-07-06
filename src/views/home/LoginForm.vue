<template>
  <b-form @submit.prevent.stop="onSubmit" id="login-form">
    <field-with-errors
      :errors="formErrors"
      autocomplete="username"
      data-cy="loginEmail"
      field="email"
      form-group-class="mb-0 mt-3"
      label="home.loginForm.email"
      object="user"
      required
      sr-only
      type="email"
      v-model="login.email" />

    <field-with-errors
      :errors="formErrors"
      autocomplete="current-password"
      data-cy="loginPassword"
      field="password"
      form-group-class="mt-0"
      label="home.loginForm.password"
      object="user"
      required
      sr-only
      type="password"
      v-model="login.password" />

    <p class="text-danger" data-cy="loginError" v-if="formError">{{formError}}</p>

    <b-button-toolbar justify>
      <b-button :disabled="busy" data-cy="loginSubmit" type="submit" variant="primary">
        {{$t('home.loginForm.submit')}}
      </b-button>
      <b-button :to="{ name: 'ForgotPassword' }" data-cy="forgotPasswordLink" variant="link">
        {{$t('home.loginForm.forgotPassword')}}
      </b-button>
    </b-button-toolbar>
  </b-form>
</template>

<script lang="ts">
  import Component, { mixins } from 'vue-class-component'
  import { Action } from 'vuex-class'
  import { Result } from 'ts-results'
  import { isString } from 'lodash-es'
  import { Login } from '@/types'
  import FieldWithErrors from '@/components/common/FieldWithErrors.vue'
  import FormErrors from '@/mixins/FormErrors'

  @Component({
    components: { FieldWithErrors }
  })
  export default class LoginForm extends mixins(FormErrors) {
    login: Login = { email: '', password: '', rememberMe: false }

    busy = false

    @Action logIn!: (args: { email: string; password: string; rememberMe: boolean })
      => Promise<Result<void, string>>

    async onSubmit(): Promise<void> {
      this.busy = true
      try {
        const result = await this.logIn({
          email: this.login.email,
          password: this.login.password,
          rememberMe: this.login.rememberMe
        })
        if (!result.ok) this.formError = result.val
      } catch (error) {
        if (error instanceof Error) {
          this.formError = error.message
        } else if (isString(error)) {
          this.formError = error
        } else {
          throw error
        }
      } finally {
        this.busy = false
        this.login.password = ''
      }
    }
  }
</script>

<style lang="scss">
  #login-form {
    input[type="email"] {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      margin-bottom: -1px;
    }

    input[type="password"] {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
</style>
