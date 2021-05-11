<template>
  <p class="text-danger">
    <b-button @click="confirmDelete" data-cy="deleteUserButton" variant="danger">
      {{$t('deleteAccount.button')}}
    </b-button>
  </p>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Action } from 'vuex-class'

  @Component
  export default class DeleteAccount extends Vue {
    @Action deleteAccount!: () => Promise<void>

    async confirmDelete(): Promise<void> {
      const result = await this.$bvModal.msgBoxConfirm(<string> this.$t('deleteAccount.confirm'), {
        okTitle: <string> this.$t('deleteAccount.confirmOK'),
        okVariant: 'danger'
      })

      if (result) await this.deleteAccount()
    }
  }
</script>
