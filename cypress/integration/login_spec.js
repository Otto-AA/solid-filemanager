describe('Login', () => {
    beforeEach(() => {
        cy.createRandomAccount().as('user')
    })
    it('can login', function () {
        cy.log(this.user)
        cy.visit('/')
        cy.get('[data-cy=idp]')
            .clear()
            .type(this.user.idp)
        cy.contains('Login').click()

        cy.url().should('include', this.user.idp)
        cy.get('label').contains('Email').click()
            .type(this.user.email)
        cy.get('label').contains('Password').click()
            .type(this.user.password)
        cy.contains('button', 'Log in').click()

        cy.url().should('include', '/consent')
        cy.contains('button', 'Consent').click()

        cy.url().should('include', `${Cypress.config().baseUrl}/`)
        // workaround to wait for the input being input automatically, so the clear works
        cy.get('[data-cy=storageLocation]').should('have.value', this.user.idp.slice(0, -1))
        cy.get('[data-cy=storageLocation]')
            .clear()
            .type(this.user.podUrl)
        cy.contains('Open directory').click()

        cy.contains('profile')
    })
})