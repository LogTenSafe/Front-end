<template>
  <form ref="manualUploadForm">
    <input @change="uploadFile"
           data-cy="fileInput"
           name="backup[logbook]"
           type="file"
           aria-label="Upload File" />
    <input name="backup[hostname]" type="hidden" value="LogTenSafe.com" />
    <p>
      <i18n class="mt-5" path="downloadClient.manualUpload" tag="small">
        <template #uploadLink>
          <a @click.prevent="chooseFile" href="#">{{$t('downloadClient.uploadLink')}}</a>
        </template>
        <template #keyboardCombo>
          <kbd>Command-Shift-G</kbd>
        </template>
        <template #path>
          <code>~/Library/Containers/com.coradine.LogTenProX/Data/Documents/LogTenProData/</code>
        </template>
        <template #button>
          <strong>Go</strong>
        </template>
        <template #file>
          <strong>LogTenCoreDataStore.sql</strong>
        </template>
      </i18n>
    </p>

    <upload-modal :upload-complete="uploadComplete" :upload-error="uploadError" />
  </form>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import Bugsnag from '@bugsnag/js'
  import { Action } from 'vuex-class'
  import UploadModal from '@/views/downloadClient/UploadModal.vue'

  @Component({
    components: { UploadModal }
  })
  export default class ManualUploadForm extends Vue {
    readonly $refs!: {
      manualUploadForm: HTMLFormElement
    }

    uploadError = false

    uploadComplete = false

    @Action addBackup!: ({ body }: { body: FormData }) => Promise<void>

    chooseFile(): void {
      const form = this.$refs.manualUploadForm
      const fileInput = <HTMLInputElement>form.elements.namedItem('backup[logbook]')

      fileInput.click()
    }

    uploadFile(): Promise<void> {
      const form = this.$refs.manualUploadForm
      this.uploadComplete = false
      this.uploadError = false

      this.$bvModal.show('uploading')
      const data = new FormData(form)
      return this.addBackup({ body: data }).then(() => {
        this.uploadComplete = true
      }).catch(error => {
        this.uploadError = true
        console.error(error)
        Bugsnag.notify(error)
      })
    }
  }
</script>

<style lang="scss" scoped>
  input {
    display: none;
  }
</style>
