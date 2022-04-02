/// <reference types="cypress-file-upload" />

/* eslint-disable cypress/no-unnecessary-waiting */

import { getStore } from '../support/utils'

describe('Logged in', () => {
  it('logs in a user', () => {
    cy.clearLocalStorage()
    getStore().then(store => store.dispatch('reset'))

    cy.visit('/')
    cy.dataCy('loginEmail').type('cypress@example.com')
    cy.dataCy('loginPassword').type('password123')
    cy.dataCy('loginSubmit').click()

    cy.location('hash').should('eql', '#/backups')
  })

  it('displays an empty backup list', () => {
    cy.dataCy('backupsContainer').get('p.lead').should('contain', 'You’re ready to start backing up your logbook.')
  })

  it('uploads a backup', () => {
    cy.fixture('LogTenCoreDataStore.sql', 'base64').then(data => {
      cy.get('[data-cy=fileInput]').attachFile({
        fileContent: data,
        filePath: 'LogTenCoreDataStore.sql',
        encoding: 'base64',
        mimeType: 'application/octet-stream'
      }, { subjectType: 'input' })
      // cy.get('.modal-footer .btn-primary').click()
      // cy.hash().should('eql', '#/backups')
      cy.dataCy('totalHours').its('length').should('eq', 1)
    })
  })

  it('lists backups', () => {
    cy.dataCy('totalHours').should('contain', '818.3')
  })

  it('downloads a backup')

  it('uploads a backup from the Download Client page', () => {
    cy.dataCy('downloadClientLink').click()
    cy.fixture('LogTenCoreDataStore.sql', 'base64').then(data => {
      cy.get('[data-cy=fileInput]').attachFile({
        fileContent: data,
        filePath: 'LogTenCoreDataStore.sql',
        encoding: 'base64',
        mimeType: 'application/octet-stream'
      }, { subjectType: 'input' })
      cy.get('.modal-footer .btn-primary').click()
      cy.dataCy('homeLink').click()
      cy.hash().should('eql', '#/backups')
      cy.dataCy('totalHours').its('length').should('eq', 1)
    })
  })

  it('deletes a backup', () => {
    cy.wait(500) // wait for the loadBackups call to run and re-establish the WebSockets connection
    cy.dataCy('deleteLink').click()
    cy.reload() // TODO why is this needed
    cy.dataCy('backupsContainer').get('p.lead').should('contain', 'You’re ready to start backing up your logbook.')
  })

  context('Password change', () => {
    it('handles password form errors', () => {
      cy.dataCy('editUserLink').click()
      cy.get('#user-current_password').type('password123')
      cy.get('#user-new_password').type('password1234')
      cy.get('#user-password_confirmation').type('password123')
      cy.dataCy('changePasswordSubmit').click()
      cy.dataCy('user-password_confirmation-group').get('.invalid-feedback').
        should('contain', 'doesn’t match password')
    })

    it("changes the user's password", () => {
      cy.get('#user-current_password').clear().type('password123')
      cy.get('#user-new_password').clear().type('password1234')
      cy.get('#user-password_confirmation').clear().type('password1234')
      cy.dataCy('changePasswordSubmit').click()
      cy.dataCy('changePasswordSuccess').should('contain', 'Your account password has been updated.')

      cy.dataCy('logOutLink').click()
      cy.location('hash').should('eql', '#/')

      cy.dataCy('loginEmail').type('cypress@example.com')
      cy.dataCy('loginPassword').type('password1234')
      cy.dataCy('loginSubmit').click()
      cy.location('hash').should('eql', '#/backups')
    })
  })

  context('Forgot password', () => {
    it('handles unknown emails', () => {
      cy.dataCy('logOutLink').click()
      cy.dataCy('forgotPasswordLink').click()

      cy.get('#user-email').type('unknown@example.com')
      cy.dataCy('forgotPasswordSubmit').click()
      cy.dataCy('user-email-group').get('.invalid-feedback').should('contain', 'not found')
    })

    it('sends a forgot-password email', () => {
      cy.get('#user-email').clear().type('cypress@example.com')
      cy.dataCy('forgotPasswordSubmit').click()
      cy.dataCy('forgotPasswordSuccess').
        should('contain', 'Password reset email sent. Check your inbox!')
    })
  })

  context('Reset password', () => {
    it('handles invalid tokens', () => {
      cy.visit('/#/reset_password/abc123')
      cy.get('#user-password').type('password123')
      cy.get('#user-password_confirmation').type('password123')
      cy.dataCy('resetPasswordSubmit').click()
      cy.get('.modal-dialog .modal-content').
        should('contain', 'The Reset Password link you used is invalid or expired.')
    })

    it('handles form errors', () => {
      cy.emailsFor('cypress@example.com').then(body => {
        const link = body.match(/<p><a href="http:\/\/localhost:5100(.+)">Change my password<\/a><\/p>/)![1]
        cy.visit(link)
        cy.get('#user-password').type('password123')
        cy.get('#user-password_confirmation').type('password1234')
        cy.dataCy('resetPasswordSubmit').click()
        cy.dataCy('user-password_confirmation-group').get('.invalid-feedback').
          should('contain', 'doesn’t match password')
      })
    })

    it('resets a user password', () => {
      cy.emailsFor('cypress@example.com').then((body: string) => {
        const link = body.match(/<p><a href="http:\/\/localhost:5100(.+)">Change my password<\/a><\/p>/)![1]
        cy.visit(link)
        cy.get('#user-password').type('password123')
        cy.get('#user-password_confirmation').type('password123')
        cy.dataCy('resetPasswordSubmit').click()
        cy.get('.modal-footer .btn-primary').click()
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500) // the page apparently reloads twice

        cy.dataCy('loginEmail').type('cypress@example.com')
        cy.dataCy('loginPassword').type('password123')
        cy.dataCy('loginSubmit').click()
        cy.location('hash').should('eql', '#/backups')
      })
    })
  })

  context('Deleting a user', () => {
    it('deletes the user', () => {
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
