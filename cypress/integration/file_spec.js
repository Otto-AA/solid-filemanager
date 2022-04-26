describe('file operations', () => {
    beforeEach('login user', () => {
        cy.createRandomAccount().as('user')
    })

    it('can create text file', function () {
        cy.login(this.user)
        cy.get('[aria-label=More]').click()
        cy.contains('Create file').click()
        cy.focused().type('pandas.txt{enter}')

        // enter file content
        // workaround because textarea somehow gets rendered multiple times
        cy.wait(5000)
        cy.get('textarea').type('Pandas are cool')
        cy.contains('Update').click()
        cy.contains('Update').should('not.exist')

        // displays created file
        cy.contains('pandas.txt')
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

    it('can copy a text file to a different folder', function () {
        const fileName = 'file.txt'
        const fileUrl = `${this.user.podUrl}/${fileName}`
        const fileContent = 'some cool content'
        const folderName = 'some folder'
        const folderUrl = `${this.user.podUrl}/${folderName}`
        cy.givenTextFile(this.user, fileUrl, fileContent)
        cy.givenFolder(this.user, folderUrl)
        cy.login(this.user)

        cy.intercept({
            method: 'PUT',
            url: `${this.user.podUrl}/${encodeURIComponent(folderName)}/${fileName}`
        }).as('putNewFile')
        cy.intercept({
            method: 'GET',
            url: `${this.user.podUrl}/${encodeURIComponent(folderName)}`
        }).as('getTargetFolder')

        // open copy menu
        cy.contains(fileName).rightclick()
        cy.contains('Copy').click()

        // select target folder and copy
        // TODO: fix %20 in application
        cy.contains('some%20folder').click()
        cy.wait('@getTargetFolder').its('response.body').should('not.include', fileName).then(cy.log)
        cy.get('button').contains('Copy').click()
        cy.wait('@putNewFile').then(({ request, response }) => {
            expect(request.body).to.equal(fileContent)
            expect(request.headers).to.include({
                'content-type': 'text/plain'
            })
            expect(response).to.have.property('statusCode', 201)
        })

        // open target folder in file explorer
        cy.contains(folderName).dblclick()
        cy.wait('@getTargetFolder').its('response.body').should('include', fileName).then(cy.log)
        cy.location('search').should('include', encodeURIComponent(encodeURIComponent(folderName)))

        // open copied file
        // TODO: fix double url encoding
        cy.contains(fileName).dblclick()
        cy.contains(fileContent)
    })
})
