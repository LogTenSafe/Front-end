import { Store } from 'vuex'
import { RootState } from '@/store/types'

// eslint-disable-next-line import/prefer-default-export
export function getStore(): Cypress.Chainable<Store<RootState>> {
  return cy.window().its('vue').its('$store')
}
