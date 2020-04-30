import { expect } from 'chai'
import { assign } from 'lodash-es'
import { mountComponent } from '../../../utils/mount'
import backups from '../../../../fixtures/allBackups'
import LastFlightCell from '@/views/backups/backupRow/LastFlightCell.vue'

describe('LastFlightCell.vue', () => {
  describe('#origin', () => {
    it('returns the origin airport', () => {
      const wrapper = mountComponent(LastFlightCell, {
        props: { backup: backups[0] }
      })
      expect(wrapper.vm.origin).to.eq('CMA')
    })

    it('returns ??? if the origin is not known', () => {
      const wrapper = mountComponent(LastFlightCell, {
        props: {
          backup: assign({}, backups[0], {
            createdAt: new Date(),
            lastFlight: {
              origin: null,
              destination: null,
              date: new Date(),
              duration: 1.0
            }
          })
        }
      })
      expect(wrapper.vm.origin).to.eq('???')
    })
  })

  describe('#destination', () => {
    it('returns the destination airport', () => {
      const wrapper = mountComponent(LastFlightCell, {
        props: { backup: backups[0] }
      })
      expect(wrapper.vm.destination).to.eq('SQL')
    })

    it('returns ??? if the destination is not known', () => {
      const wrapper = mountComponent(LastFlightCell, {
        props: {
          backup: assign({}, backups[0], {
            createdAt: new Date(),
            lastFlight: {
              origin: null,
              destination: null,
              date: new Date(),
              duration: 1.0
            }
          })
        }
      })
      expect(wrapper.vm.destination).to.eq('???')
    })
  })
})
