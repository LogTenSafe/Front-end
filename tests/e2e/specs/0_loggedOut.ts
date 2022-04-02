describe('Logged out', () => {
  it('displays the client download page', () => {
    cy.request('/cypress/reset')
    cy.clearLocalStorage()

    cy.visit('/#/download')
    cy.dataCy('fileInput').should('not.exist')
  })

  it('handles an invalid login', () => {
    cy.visit('/')
    cy.dataCy('loginEmail').type('cypress@example.com')
    cy.dataCy('loginPassword').type('password123')
    cy.dataCy('loginSubmit').click()

    cy.dataCy('loginError').should('contain', 'Invalid Email or password.')
  })

  it('handles signup errors', () => {
    cy.dataCy('getStarted').click()
    cy.dataCy('signupEmail').type('cypress@example.com')
    cy.dataCy('signupPassword').type('password123')
    cy.dataCy('signupPasswordConfirmation').type('differentpw')
    cy.dataCy('signupSubmit').click()

    cy.dataCy('user-password_confirmation-group').get('.invalid-feedback').
      should('contain', 'doesn’t match password')
    cy.dataCy('signupPassword').should('have.value', '')
    cy.dataCy('signupPasswordConfirmation').should('have.value', '')
  })

  it('signs up a user', () => {
    cy.visit('/#/signup')
    cy.dataCy('signupEmail').type('cypress@example.com')
    cy.dataCy('signupPassword').type('password123')
    cy.dataCy('signupPasswordConfirmation').type('password123')
    cy.dataCy('signupSubmit').click()

    cy.hash().should('eql', '#/backups')
  })
})
