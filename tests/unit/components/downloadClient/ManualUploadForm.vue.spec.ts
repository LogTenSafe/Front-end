import { expect } from 'chai'
import { Wrapper } from '@vue/test-utils'
import { SinonStub } from 'sinon'
import { mountComponent } from '../../utils/mount'
import { getSandbox } from '../../setup'
import ManualUploadForm from '@/views/downloadClient/ManualUploadForm.vue'

describe('ManualUploadForm.vue', () => {
  describe('#chooseFile', () => {
    let wrapper: Wrapper<ManualUploadForm>

    beforeEach(() => {
      wrapper = mountComponent(ManualUploadForm, {
        store: {
          session: {
            getters: {
              loggedIn: () => true
            }
          }
        }
      })
    })

    it('clicks the file input', () => {
      const fileInput: HTMLInputElement = <HTMLInputElement>wrapper.get('input[type=file]').element
      const clickSpy = getSandbox().stub(fileInput, 'click')
      wrapper.vm.chooseFile()

      expect(clickSpy).to.have.been.calledOnce
    })
  })

  describe('#uploadFile', () => {
    let wrapper: Wrapper<ManualUploadForm>
    let component: ManualUploadForm
    let modalShowSpy: SinonStub

    beforeEach(() => {
      wrapper = mountComponent(ManualUploadForm, {})
      component = wrapper.vm
      modalShowSpy = getSandbox().stub(component.$bvModal, 'show').resolves()
    })

    it('displays a modal and adds a backup', async () => {
      const addBackupSpy = getSandbox().stub(component, 'addBackup').resolves()
      await component.uploadFile()
      expect(modalShowSpy).to.have.been.calledOnceWith('uploading')
      expect(addBackupSpy).to.have.been.calledOnce
      expect(component.uploadComplete).to.be.true
      expect(component.uploadError).to.be.false
    })

    it('displays an error', async () => {
      getSandbox().stub(component, 'addBackup').rejects()
      await component.uploadFile()
      expect(modalShowSpy).to.have.been.calledOnceWith('uploading')
      expect(component.uploadError).to.be.true
    })
  })
})
