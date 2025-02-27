const path = require('path');
const JSZip = require('jszip')

describe('file operations', () => {
    beforeEach('login user', () => {
        cy.createRandomAccount().as('user')
    })

    it('can download multiple files as a zip', function () {
        const files = [{
            name: 'first.txt',
            content: 'some test',
        }, {
            name: 'second.txt',
            content: 'other test',
        }];
        for (const file of files) {
            const fileUrl = `${this.user.podUrl}/${file.name}`
            cy.givenTextFile(this.user, fileUrl, file.content)
        }
        cy.login(this.user)

        // select files
        for (const file of files) {
            cy.contains(file.name).click({ ctrlKey: true })
        }

        // right click any of those files and download zip
        cy.contains(files[0].name).rightclick()
        cy.contains("Download Zip").click()

        const zipPath = path.join(Cypress.config("downloadsFolder"), "Archive.zip");
        cy.readFile(zipPath, 'base64').then(async (file) => {
            const zip = await JSZip.loadAsync(file, { base64: true })
            expect(Object.keys(zip.files).length).to.eq(2)
            expect(await zip.file('first.txt').async('string')).to.eq('some test')
            expect(await zip.file('second.txt').async('string')).to.eq('other test')
        })
    })

    it('can download a folder as a zip', function () {
        const folderName = 'some-folder'
        const folderUrl = `${this.user.podUrl}/${folderName}`
        cy.givenFolder(this.user, folderUrl)
        cy.givenTextFile(this.user, `${folderUrl}/shallow.txt`, 'shallow content')
        cy.givenFolder(this.user, `${folderUrl}/nested`)
        cy.givenTextFile(this.user, `${folderUrl}/nested/deep.txt`, 'nested content')

        cy.login(this.user)

        cy.contains(folderName).rightclick()
        cy.contains("Download Zip").click()

        const zipPath = path.join(Cypress.config("downloadsFolder"), `${folderName}.zip`);
        cy.readFile(zipPath, 'base64').then(async (file) => {
            const zip = await JSZip.loadAsync(file, { base64: true })
            expect(Object.keys(zip.files).length).to.eq(4)
            expect(await zip.folder('some-folder').file('shallow.txt').async('string')).to.eq('shallow content')
            expect(await zip.folder('some-folder').folder('nested').file('deep.txt').async('string')).to.eq('nested content')
        })
    })

    it('can extract a nested zip', function () {
        // prepare my-archive.zip on the pod
        const zip = new JSZip()
        zip.file('shallow.txt', 'shallow content')
        zip.file('nested/deep.txt', 'nested content')
        cy.wrap(null).then(() => {
            return zip.generateAsync({ type: 'blob' }).then(blob => {
                cy.givenBlob(this.user, `${this.user.podUrl}/my-archive.zip`, blob)
            })
        })

        cy.login(this.user)

        // Extract
        cy.contains('my-archive.zip').rightclick()
        cy.contains('Extract here').click()

        // verify the files are uploaded and thus accessible via the user interface
        cy.contains('shallow.txt')
        cy.contains('nested').dblclick()
        cy.contains('deep.txt').dblclick()
        cy.contains('nested content')
    })
})
