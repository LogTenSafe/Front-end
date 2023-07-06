/// <reference types="cypress-file-upload" />

describe('Logged in', () => {
  context('User without backups', () => {
    beforeEach(() => {
      cy.request('/cypress/reset?skip_backup')

      cy.visit('/')
      cy.dataCy('loginEmail').type('cypress@example.com')
      cy.dataCy('loginPassword').type('password123')
      cy.dataCy('loginSubmit').click()
      cy.location('hash').should('eql', '#/backups')
    })

    context('Backups', () => {
      it('displays an empty backup list', () => {
        cy.visit('/')
        cy.dataCy('backupsContainer').
          get('p.lead').
          should('contain', 'You’re ready to start backing up your logbook.')
      })

      it('uploads a backup', () => {
        cy.visit('/')

        cy.fixture('LogTenCoreDataStore.sql', 'base64').then(data => {
          cy.get('[data-cy=fileInput]').attachFile(
            {
              fileContent: data,
              filePath: 'LogTenCoreDataStore.sql',
              encoding: 'base64',
              mimeType: 'application/octet-stream'
            },
            { subjectType: 'input' }
          )
          // cy.get('.modal-footer .btn-primary').click()
          // cy.hash().should('eql', '#/backups')
          cy.dataCy('totalHours').its('length').should('eq', 1)
        })
      })

      it('uploads a backup from the Download Client page', () => {
        cy.visit('/')
        cy.dataCy('downloadClientLink').click()

        cy.fixture('LogTenCoreDataStore.sql', 'base64').then(data => {
          cy.get('[data-cy=fileInput]').attachFile(
            {
              fileContent: data,
              filePath: 'LogTenCoreDataStore.sql',
              encoding: 'base64',
              mimeType: 'application/octet-stream'
            },
            { subjectType: 'input' }
          )
          cy.get('.modal-footer .btn-primary').click()
          cy.dataCy('homeLink').click()
          cy.hash().should('eql', '#/backups')
          cy.dataCy('totalHours').its('length').should('eq', 1)
        })
      })
    })

    context('User account', () => {
      context('Password change', () => {
        it('handles password form errors', () => {
          cy.visit('/')
          cy.dataCy('editUserLink').click()

          cy.get('#user-current_password').type('password123')
          cy.get('#user-new_password').type('password1234')
          cy.get('#user-password_confirmation').type('password123')
          cy.dataCy('changePasswordSubmit').click()
          cy.dataCy('user-password_confirmation-group').
            get('.invalid-feedback').
            should('contain', 'doesn’t match password')
        })

        it("changes the user's password", () => {
          cy.visit('/')
          cy.dataCy('editUserLink').click()

          cy.get('#user-current_password').type('password123')
          cy.get('#user-new_password').type('password1234')
          cy.get('#user-password_confirmation').type('password1234')
          cy.dataCy('changePasswordSubmit').click()
          cy.dataCy('changePasswordSuccess').should(
            'contain',
            'Your account password has been updated.'
          )

          cy.dataCy('logOutLink').click()
          cy.location('hash').should('eql', '#/')

          cy.dataCy('loginEmail').type('cypress@example.com')
          cy.dataCy('loginPassword').type('password1234')
          cy.dataCy('loginSubmit').click()
          cy.location('hash').should('eql', '#/backups')
        })
      })

      it('deletes the user', () => {
        cy.visit('/')
        cy.dataCy('editUserLink').click()

        cy.dataCy('deleteUserButton').click()
        cy.get('.modal-dialog .btn-secondary').click()

        cy.dataCy('deleteUserButton').click()
        cy.get('.modal-dialog .btn-danger').click()
        cy.location('hash').should('eql', '#/')
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500) // the page apparently reloads twice

        cy.dataCy('loginEmail').type('cypress@example.com')
        cy.dataCy('loginPassword').type('password1234')
        cy.dataCy('loginSubmit').click()
        cy.dataCy('loginError').should('contain', 'Invalid Email or password.')
      })
    })
  })

  context('User with backups', () => {
    beforeEach(() => {
      cy.request('/cypress/reset')

      cy.visit('/')
      cy.dataCy('loginEmail').type('cypress@example.com')
      cy.dataCy('loginPassword').type('password123')
      cy.dataCy('loginSubmit').click()
      cy.location('hash').should('eql', '#/backups')
    })

    it('lists backups', () => {
      cy.visit('/')
      cy.dataCy('totalHours').should('contain', '818.3')
    })

    it('downloads a backup')

    it('deletes a backup', () => {
      cy.visit('/')
      cy.dataCy('deleteLink').click()

      cy.reload() // TODO why is this needed
      cy.dataCy('backupsContainer').
        get('p.lead').
        should('contain', 'You’re ready to start backing up your logbook.')
    })
  })
})
