<template>
  <div>
    <i18n path="downloadClient.description" tag="p">
      <template #clientLink>
        <a
          href="https://github.com/LogTenSafe/macOS/releases/download/2.0.1/LogTenSafe.zip"
          rel="noopener"
          target="_blank"
        >
          {{ $t("downloadClient.clientLink") }}
        </a>
      </template>
    </i18n>

    <b-img
      :alt="$t('downloadClient.clientImageAlt')"
      center
      fluid
      src="./../assets/images/client.png"
    />

    <manual-upload-form v-if="loggedIn" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Getter } from 'vuex-class'
  import ManualUploadForm from '@/views/downloadClient/ManualUploadForm.vue'

  @Component({
    components: { ManualUploadForm }
  })
  export default class DownloadClient extends Vue {
    @Getter loggedIn!: boolean
  }
</script>

<style lang="scss" scoped>
img {
  max-width: 621px; // don't go above native resolution
}
</style>
