describe('Read file', () => {
    beforeEach('login user', () => {
        cy.createRandomAccount().as('user')
    })

    it('can read a text file', function () {
        const fileName = 'file.txt'
        const fileUrl = `${this.user.podUrl}/${fileName}`
        const fileContent = 'some cool content'
        cy.givenTextFile(this.user, fileUrl, fileContent)
        cy.login(this.user)

        cy.contains(fileName).dblclick()
        cy.contains(fileContent)
    })
})