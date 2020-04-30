import Vue from 'vue'

declare global {
  interface Window {
    Cypress: unknown;
    vue: Vue;
  }
}
