describe('The Home Page', () => {
    it('successfully loads', () => {
        cy.visit('/')
    })

    it('successfully loads developing IDP', () => {
        cy.visit('http://localhost:8080/')
    })

    xit('can create new accounty', () => {
        cy.visit('http://localhost:8080/')
        cy.contains('Sign up').click()
        cy.contains('Pod name').click()
            .type('testomate')
        cy.contains('Email').click()
            .type('test@example.com')
        cy.contains('Password').click()
            .type('12345')
        cy.contains('Confirm password').click()
            .type('12345')
        cy.get('button').contains('Sign up').click()
        cy.contains("You've been signed up")
        cy.contains('http://localhost:8080/test').click()
        cy.contains('Contents of testomate')
    })

    it('can use createRandomAccount', () => {
        cy.createRandomAccount().then(console.log)
    })
})