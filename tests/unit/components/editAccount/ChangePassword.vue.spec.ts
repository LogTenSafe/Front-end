import { shallowMount } from '@vue/test-utils'
import { Ok } from 'ts-results'
import { expect } from 'chai'
import { componentLocalVue } from '../../utils'
import i18n from '@/i18n'
import ChangePassword from '@/views/editAccount/ChangePassword.vue'

describe('ChangePassword.vue', () => {
  describe('#onSubmit', () => {
    it('resets the password fields on success', () => {
      const wrapper = shallowMount(ChangePassword, {
        localVue: componentLocalVue(),
        mocks: {
          changePassword: () => new Ok(undefined)
        },
        i18n
      })
      const vue: ChangePassword = wrapper.vm

      vue.onSubmit()

      expect(vue.currentPassword).to.eql('')
      expect(vue.newPassword).to.eql('')
      expect(vue.passwordConfirmation).to.eql('')
    })
  })
})
