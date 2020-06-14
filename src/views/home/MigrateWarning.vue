<template>
  <b-row>
    <b-col />
    <b-col cols="8">
      <b-card border-variant="danger"
              class="mt-5 mb-5"
              text-variant="danger"
              title="Can’t log in? Please read this.">
        <b-card-text>Important! Everything has been moved to a brand-new
          website. The new website requires an email address to log in (so
          that I can help you if you need to reset your password, or find
          missing backups). The old website did not. If you have backups on
          the old website that you need, please <strong>create a new account,
            then <a href="mailto:logtensafe@timothymorgan.info">email me</a>
            your old login</strong>, and I will move your backups over to your
          new account. Sorry for the inconvenience!
        </b-card-text>
      </b-card>
    </b-col>
    <b-col />
  </b-row>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { BCard, BCardText } from 'bootstrap-vue'

  @Component({
    components: { BCard, BCardText }
  })
  export default class MigrateWarning extends Vue {
  }
</script>

<style scoped>

</style>
