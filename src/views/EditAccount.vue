<template>
  <must-be-authenticated>
    <narrow>
      <h4 class="mb-3">{{$t('changePassword.title')}}</h4>
      <change-password />

      <h4 class="mt-5 mb-3">{{$t('deleteAccount.title')}}</h4>
      <delete-account />
    </narrow>
  </must-be-authenticated>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import Narrow from '@/components/common/Narrow.vue'
  import ChangePassword from '@/views/editAccount/ChangePassword.vue'
  import MustBeAuthenticated from '@/components/guards/MustBeAuthenticated.vue'
  import DeleteAccount from '@/views/editAccount/DeleteAccount.vue'

  @Component({
    components: {
      DeleteAccount, MustBeAuthenticated, Narrow, ChangePassword
    }
  })
  export default class EditAccount extends Vue {
  }
</script>
