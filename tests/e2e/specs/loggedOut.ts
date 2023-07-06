describe('Logged out', () => {
  before(() => cy.request('/cypress/reset?skip_backup'))

  it('displays the client download page', () => {
    cy.visit('/#/download')
    cy.dataCy('fileInput').should('not.exist')
  })

  it('handles an invalid login', () => {
    cy.visit('/')

    cy.dataCy('loginEmail').type('cypress2@example.com')
    cy.dataCy('loginPassword').type('password123')
    cy.dataCy('loginSubmit').click()

    cy.dataCy('loginError').should('contain', 'Invalid Email or password.')
  })

  context('Signup', () => {
    it('handles signup errors', () => {
      cy.visit('/')

      cy.dataCy('getStarted').click()
      cy.dataCy('signupEmail').type('cypress2@example.com')
      cy.dataCy('signupPassword').type('password123')
      cy.dataCy('signupPasswordConfirmation').type('differentpw')
      cy.dataCy('signupSubmit').click()

      cy.dataCy('user-password_confirmation-group').get('.invalid-feedback').should('contain', 'doesn’t match password')
      cy.dataCy('signupPassword').should('have.value', '')
      cy.dataCy('signupPasswordConfirmation').should('have.value', '')
    })

    it('signs up a user', () => {
      cy.visit('/#/signup')

      cy.dataCy('signupEmail').type('cypress2@example.com')
      cy.dataCy('signupPassword').type('password123')
      cy.dataCy('signupPasswordConfirmation').type('password123')
      cy.dataCy('signupSubmit').click()

      cy.hash().should('eql', '#/backups')
    })
  })

  context('Forgot password', () => {
    it('handles unknown emails', () => {
      cy.visit('/')
      cy.dataCy('forgotPasswordLink').click()

      cy.get('#user-email').type('unknown@example.com')
      cy.dataCy('forgotPasswordSubmit').click()
      cy.dataCy('user-email-group').get('.invalid-feedback').should('contain', 'not found')
    })

    it('sends a forgot-password email', () => {
      cy.visit('/')
      cy.dataCy('forgotPasswordLink').click()

      cy.get('#user-email').type('cypress@example.com')
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
})
