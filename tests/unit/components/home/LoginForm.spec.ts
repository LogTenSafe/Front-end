import { Wrapper } from '@vue/test-utils'
import { SinonStub } from 'sinon'
import { expect } from 'chai'
import { Err, Ok } from 'ts-results'
import { mountComponent } from '../../utils/mount'
import { getSandbox } from '../../setup'
import LoginForm from '@/views/home/LoginForm.vue'

describe('LoginForm.vue', () => {
  let factory: () => Wrapper<LoginForm>

  beforeEach(() => {
    factory = () => mountComponent(LoginForm, {
      mocks: {
        $router: { push: () => Promise.resolve() }
      }
    })
  })

  describe('#onSubmit', () => {
    context('[success]', () => {
      let wrapper: Wrapper<LoginForm>
      let component: LoginForm
      let loginSpy: SinonStub

      beforeEach(() => {
        wrapper = factory()
        component = wrapper.vm
        wrapper.get('input[type=email]').setValue('test@email.com')
        wrapper.get('input[type=password]').setValue('testpassword')
        loginSpy = getSandbox().stub(component, 'logIn').resolves(new Ok(undefined))
      })

      it('logs the user in', async () => {
        await component.onSubmit()
        expect(loginSpy).to.have.been.calledOnceWith({
          email: 'test@email.com',
          password: 'testpassword',
          rememberMe: false
        })
      })
    })

    context('[failure]', () => {
      let wrapper: Wrapper<LoginForm>
      let component: LoginForm
      let loginSpy: SinonStub

      beforeEach(() => {
        wrapper = factory()
        component = wrapper.vm
        wrapper.get('input[type=email]').setValue('test@email.com')
        wrapper.get('input[type=password]').setValue('testpassword')
        loginSpy = getSandbox().stub(component, 'logIn').resolves(new Err('Error'))
      })

      it('displays the error and resets the password field', async () => {
        await component.onSubmit()
        expect(loginSpy).to.be.called
        expect((<HTMLInputElement>wrapper.get('input[type=password]').element).value).to.eq('')
        expect(component.formError).to.eql('Error')
      })
    })
  })
})
