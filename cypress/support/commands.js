// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const uuid = require('uuid')

Cypress.Commands.add('createRandomAccount', () => {
    const baseUrl = 'http://localhost:8080'
    const username = 'test-'  + uuid.v4()
    const password = '12345'
    const email = `${username}@example.org`
    const config = {
        idp: `${baseUrl}/`,
        podUrl: `${baseUrl}/${username}`,
        webId: `${baseUrl}/${username}/profile/card#me`,
        username,
        password,
        email,
    }
    const registerEndpoint = `${baseUrl}/idp/register/`
    cy.request('POST', registerEndpoint, {
        createWebId: 'on',
        webId: '',
        register: 'on',
        createPod: 'on',
        podName: username,
        email,
        password,
        confirmPassword: password,
    })

    return cy.wrap(config)
})

/**
 * Manually logins the user
 * Assumes it is previously not logged in
 */
Cypress.Commands.add('login', user => {
    const typeFastConfig = {
        delay: 0
    }

    cy.log('login', user)
    cy.visit('/')
    cy.get('[data-cy=idp]')
        .clear()
        .type(user.idp, typeFastConfig)
    cy.contains('Login').click()

    cy.url().should('include', user.idp)
    cy.get('label').contains('Email').click()
        .type(user.email, typeFastConfig)
    cy.get('label').contains('Password').click()
        .type(user.password, typeFastConfig)
    cy.contains('button', 'Log in').click()

    cy.url().should('include', '/consent')
    cy.contains('button', 'Consent').click()

    cy.url().should('include', `${Cypress.config().baseUrl}/`)
    // workaround to wait for the input being input automatically, so the clear works
    cy.get('[data-cy=storageLocation]').should('have.value', user.idp.slice(0, -1))
    cy.get('[data-cy=storageLocation]')
        .clear()
        .type(user.podUrl, typeFastConfig)
    cy.contains('Open directory').click()

    cy.contains('profile')
})

Cypress.Commands.add('inputFromLabel', label => {
    return cy.contains('label', label)
        .invoke('attr', 'for')
        .then(id => cy.get('#' + id))
})
