import { Wrapper } from '@vue/test-utils'
import * as sinon from 'sinon'
import { expect } from 'chai'
import backups from '../../../../fixtures/allBackups'
import { mountComponent } from '../../../utils/mount'
import ActionsCell from '@/views/backups/backupRow/ActionsCell.vue'

describe('ActionsCell.vue', () => {
  describe('#onDelete', () => {
    let factory: () => Wrapper<ActionsCell>

    beforeEach(() => {
      factory = () => mountComponent(ActionsCell, {
        props: { backup: backups[0] }
      })
    })

    it('deletes the backup', async () => {
      const wrapper = factory()
      const modalSpy = sinon.stub(wrapper.vm.$bvModal, 'msgBoxOk')
      const deleteSpy = sinon.stub(wrapper.vm, 'deleteBackup').resolves()
      await wrapper.vm.onDelete()

      expect(deleteSpy).to.have.been.calledOnce
      expect(modalSpy).not.to.have.been.called
    })

    it('displays an alert if the delete fails', async () => {
      const wrapper = factory()
      const modalSpy = sinon.stub(wrapper.vm.$bvModal, 'msgBoxOk')
      const deleteSpy = sinon.stub(wrapper.vm, 'deleteBackup').rejects()
      await wrapper.vm.onDelete()

      expect(deleteSpy).to.have.been.calledOnce
      expect(modalSpy).to.have.been.calledOnce
    })
  })
})
