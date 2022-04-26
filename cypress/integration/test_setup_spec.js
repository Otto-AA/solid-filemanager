describe('The Home Page', () => {
    it('can use createRandomAccount', () => {
        cy.createRandomAccount().then(console.log)
    })

    it('can use login command', () => {
        cy.createRandomAccount().as('user')
        cy.get('@user').then(user => cy.login(user))
    })
})