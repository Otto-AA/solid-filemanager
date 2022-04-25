describe('The Home Page', () => {
    it('can use createRandomAccount', () => {
        cy.createRandomAccount().then(console.log)
    })
})