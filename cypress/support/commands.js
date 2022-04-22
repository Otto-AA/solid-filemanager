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

const { createDpopHeader, generateDpopKeyPair, buildAuthenticatedFetch } = require('@inrupt/solid-client-authn-core')
const uuid = require('uuid')
const cssBaseUrl = 'http://localhost:8080'


/**
 * pretends to be a normal fetch
 * this can be passed to buildAuthenticatedFetch
 * and it will resolve with { options }
 * 
 * this is used to get the valid authentication headers from buildAuthenticatedFetch
 */
const cyFetchWrapper = (url, options = {}) => {
    options.method ??= 'GET'
    options.url = url
    options.headers = Object.fromEntries(options.headers.entries())
    // mock response
    return {
        ok: true, // buildAUthenticatedFetch relies on response.ok to be true. Else it checks for unauthorized errors
        options,
    }
}

/**
 * uses the authenticatio headers from cyFetchWrapper
 * and makes a cy.request
 */
const cyUnwrapFetch = wrappedFetch => {
    return async (...args) => {
        const res = await wrappedFetch(...args)
        return cy.request(res.options)
    }
}

Cypress.Commands.add('createRandomAccount', () => {
    const username = 'test-'  + uuid.v4()
    const password = '12345'
    const email = `${username}@example.org`
    const config = {
        idp: `${cssBaseUrl}/`,
        podUrl: `${cssBaseUrl}/${username}`,
        webId: `${cssBaseUrl}/${username}/profile/card#me`,
        username,
        password,
        email,
    }
    const registerEndpoint = `${cssBaseUrl}/idp/register/`
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

Cypress.Commands.add('authenticatedFetch', (user, ...args) => {
    return cy.getAuthenticatedFetch(user)
        .then(fetch => fetch(...args))
})

Cypress.Commands.add('getAuthenticatedFetch', user => {
    // see https://github.com/CommunitySolidServer/CommunitySolidServer/blob/main/documentation/client-credentials.md
    const credentialsEndpoint = `${cssBaseUrl}/idp/credentials/`
    return cy.request('POST', credentialsEndpoint, {
        email: user.email,
        password: user.password,
        name: 'cypress-login-token',
    }).then(async response => {
        const { id, secret } = response.body
        const dpopKey = await generateDpopKeyPair()
        const authString = `${encodeURIComponent(id)}:${encodeURIComponent(secret)}`
        const tokenEndpoint = `${cssBaseUrl}/.oidc/token`
        cy.request({
            method: 'POST',
            url: tokenEndpoint,
            headers: {
                authorization: `Basic ${Buffer.from(authString).toString('base64')}`,
                'content-type': 'application/x-www-form-urlencoded',
                dpop: await createDpopHeader(tokenEndpoint, 'POST', dpopKey),
            },
            body: 'grant_type=client_credentials&scope=webid',
        }).then(async response => {
            const {access_token: accessToken } = response.body
            const authFetchWrapper = await buildAuthenticatedFetch(cyFetchWrapper, accessToken, { dpopKey })
            const authFetch = cyUnwrapFetch(authFetchWrapper)
            return cy.wrap(authFetch)
        })
    })

})

Cypress.Commands.add('inputFromLabel', label => {
    return cy.contains('label', label)
        .invoke('attr', 'for')
        .then(id => cy.get('#' + id))
})

/** recursively creates folder and leaves a .test.keep file inside
 * requires permissions to do so */
Cypress.Commands.add('givenFolder', (user, url) => {
    if (!url.endsWith('/'))
        url += '/'
    
    // putting file which recursively creates parent containers
    const tempFileUrl = url + '.test.keep'
    cy.authenticatedFetch(user, url, {
        method: 'PUT',
        headers: {
            'content-type': 'text/plain'
        }
    })
    /* somehow this also deletes the created folders
    cy.authenticatedFetch(user, url, {
        method: 'DELETE',
    })
    */
})

Cypress.Commands.add('givenTextFile', (user, url, content) => {
    cy.authenticatedFetch(user, url, {
        method: 'PUT',
        headers: {
            'content-type': 'text/plain'
        },
        body: content
    })
})