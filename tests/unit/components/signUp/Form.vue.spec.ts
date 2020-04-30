import { expect } from 'chai'
import { Err, Ok } from 'ts-results'
import { mountComponent } from '../../utils/mount'
import { getSandbox } from '../../setup'
import Form from '@/views/signUp/Form.vue'

describe('signUp/Form.vue', () => {
  describe('#onSubmit', () => {
    it('signs up the user', async () => {
      const signUpSpy = getSandbox().stub().resolves(new Ok(null))
      const wrapper = mountComponent(Form, {
        mocks: {
          $router: { push: () => Promise.resolve() }
        },
        stubs: ['router-link'],
        store: {
          session: {
            getters: {
              loggedIn: () => false
            }
          },
          backups: {
            actions: {
              signUp: signUpSpy
            }
          }
        }
      })

      await wrapper.vm.onSubmit()
      expect(wrapper.vm.formError).to.be.null
      expect(wrapper.vm.formErrors).to.be.null
    })

    it('displays validation errors and resets the password field', async () => {
      const signUpSpy = getSandbox().stub().resolves(new Err({
        body:
          {
            errors: {
              password: ['too short']
            }
          }
      }))
      const routerSpy = getSandbox().stub().resolves()
      const wrapper = mountComponent(Form, {
        mocks: {
          $router: { push: routerSpy }
        },
        stubs: ['router-link'],
        store: {
          session: {
            getters: {
              loggedIn: () => false
            }
          },
          backups: {
            actions: {
              signUp: signUpSpy
            }
          }
        }
      })

      await wrapper.vm.onSubmit()
      expect(wrapper.vm.formError).to.be.null
      expect(wrapper.vm.formErrors).to.eql({ password: ['too short'] })
      expect(routerSpy).not.to.have.been.called
    })

    it('displays other errors and resets the password field', async () => {
      const signUpSpy = getSandbox().stub().rejects(new Error('Failure town'))
      const routerSpy = getSandbox().stub().resolves()
      const wrapper = mountComponent(Form, {
        mocks: {
          $router: { push: routerSpy }
        },
        stubs: ['router-link'],
        store: {
          session: {
            getters: {
              loggedIn: () => false
            }
          },
          backups: {
            actions: {
              signUp: signUpSpy
            }
          }
        }
      })

      await wrapper.vm.onSubmit()
      expect(wrapper.vm.formError).to.eql('Failure town')
      expect(wrapper.vm.formErrors).to.be.null
      expect(routerSpy).not.to.have.been.called
    })
  })
})
