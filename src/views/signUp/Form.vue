<template>
  <b-form @submit.prevent="onSubmit" class="mt-5 mb-3">
    <field-with-errors :errors="formErrors"
                       autocomplete="username"
                       data-cy="signupEmail"
                       field="email"
                       form-group-class="mt-2"
                       label="signup.email"
                       object="user"
                       required
                       sr-only
                       type="email"
                       v-model="signup.email" />

    <field-with-errors :errors="formErrors"
                       autocomplete="current-password"
                       data-cy="signupPassword"
                       field="password"
                       label="signup.password"
                       object="user"
                       required
                       sr-only
                       type="password"
                       v-model="signup.password" />

    <field-with-errors :errors="formErrors"
                       autocomplete="current-password"
                       data-cy="signupPasswordConfirmation"
                       field="password_confirmation"
                       label="signup.passwordConfirmation"
                       object="user"
                       required
                       sr-only
                       type="password"
                       v-model="signup.passwordConfirmation" />

    <b-button :disabled="busy" data-cy="signupSubmit" type="submit">
      {{$t('signup.submit')}}
    </b-button>

    <p class="text-danger" v-if="formError">{{formError}}</p>
  </b-form>
</template>

<script lang="ts">
  import Component, { mixins } from 'vue-class-component'
  import { Action } from 'vuex-class'
  import { has } from 'lodash-es'
  import FormErrors from '../../mixins/FormErrors'
  import { Signup } from '../../types'
  import { APIFailure, APIResponse } from '../../store/types'
  import FieldWithErrors from '../../components/common/FieldWithErrors.vue'

  @Component({
    components: { FieldWithErrors }
  })
  export default class Form extends mixins(FormErrors) {
    signup: Signup = { email: '', password: '', passwordConfirmation: '' }

    busy = false

    @Action signUp!: (args: { signup: Signup }) => Promise<APIResponse<void>>

    async onSubmit(): Promise<void> {
      this.busy = true
      try {
        const result = await this.signUp({ signup: this.signup })
        if (!result.ok) this.formErrors = (<APIFailure>result.val).body.errors ?? null
      } catch (error) {
        if (has(error, 'val')) this.formErrors = (<APIFailure>error.val).body.errors ?? null
        else this.formError = error.message
      } finally {
        this.busy = false
        this.signup.password = ''
        this.signup.passwordConfirmation = ''
      }
    }
  }
</script>

<style scoped>

</style>
