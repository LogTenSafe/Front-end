<template>
  <footer class="footer">
    <b-container>
      {{$t('footer.copyright')}}

      <small><a href="https://github.com/LogTenSafe" target="_blank" rel="noopener">
        {{$t('footer.contribute')}}
      </a></small>
    </b-container>
  </footer>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  @Component
  export default class Footer extends Vue {
  }
</script>
