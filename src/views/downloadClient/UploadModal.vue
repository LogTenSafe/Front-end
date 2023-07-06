<template>
  <b-modal
    :title="$t('downloadClient.uploadingModal.title')"
    data-cy="uploadingModal"
    id="uploading"
    ok-only>
    <p v-if="uploadComplete">{{$t('downloadClient.uploadingModal.complete')}}</p>
    <p class="text-danger" v-else-if="uploadError">
      {{$t('downloadClient.uploadingModal.failed')}}
    </p>
    <p v-else>{{$t('downloadClient.uploadingModal.contents')}}</p>
  </b-modal>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'

  @Component
  export default class UploadModal extends Vue {
    @Prop({ type: Boolean, required: true }) uploadComplete!: boolean

    @Prop({ type: Boolean, required: true }) uploadError!: boolean
  }
</script>
