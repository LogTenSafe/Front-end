import { mountComponent } from '../utils/mount'
import { getSandbox } from '../setup'
import { expect } from 'chai'
import Home from '@/views/Home.vue'

describe('Home.vue', () => {
  describe('#mounted', () => {
    it('redirects to /backups if the user is logged in', () => {
      const routerSpy = getSandbox().stub().resolves()
      mountComponent(Home, {
        mocks: {
          $router: { push: routerSpy }
        },
        store: {
          session: {
            getters: {
              loggedIn: () => true
            }
          }
        }
      })

      expect(routerSpy).to.have.been.calledOnceWith({ name: 'BackupsIndex' })
    })

    it('does not redirect if the user is not logged in', () => {
      const routerSpy = getSandbox().stub().resolves()
      mountComponent(Home, {
        mocks: {
          $router: { push: routerSpy }
        },
        store: {
          session: {
            getters: {
              loggedIn: () => false
            }
          }
        }
      })

      expect(routerSpy).not.to.have.been.called
    })
  })
})
