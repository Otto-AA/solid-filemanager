describe('Create file', () => {
    beforeEach('login user', () => {
        cy.createRandomAccount().as('user')
            .then(user => cy.login(user))
    })

    it('can create text file', () => {
        cy.get('[aria-label=More]').click()
        cy.contains('Create file').click()
        cy.focused().type('pandas.txt{enter}')

        // enter file content
        // workaround because textarea somehow gets rendered multiple times
        cy.wait(1000)
        cy.get('textarea').type('Pandas are cool')
        cy.contains('Update').click()
        cy.contains('Update').should('not.exist')

        // displays created file
        cy.contains('pandas.txt')
    })
})