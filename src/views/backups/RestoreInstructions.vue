<template>
  <div>
    <i18n path="restoreInstructions.description1" tag="p">
      <template #goToMenuItem>
        <strong>{{$t('restoreInstructions.goToMenuItem')}}</strong>
      </template>
      <template #goToShortcut>
        <kbd>{{$t('restoreInstructions.goToShortcut')}}</kbd>
      </template>
      <template #path>
        <code>~/Library/Containers/com.coradine.LogTenProX/Data/Documents/LogTenProData/</code>
      </template>
      <template #goButton>
        <strong>{{$t('restoreInstructions.goButton')}}</strong>
      </template>
    </i18n>

    <b-img src="./../../assets/images/go-to-folder.png" :alt="$t('goWindowAlt')" fluid />

    <i18n path="restoreInstructions.description2" tag="p">
      <template #filename>
        <strong>LogTenCoreDataStore.sql</strong>
      </template>
      <template #data>
        <strong>Data</strong>
      </template>
    </i18n>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  @Component
  export default class RestoreInstructions extends Vue {
  }
</script>
