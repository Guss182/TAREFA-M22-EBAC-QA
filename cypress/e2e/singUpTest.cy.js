/// <reference types="cypress" />

const accountPage = require('../support/pages/account.page')
const { uniqueEmail, strongPassword } = require('../support/utils')

describe('Cadastro de conta', () => {
  it('deve cadastrar um usuário com dados aleatórios', () => {
    const email = uniqueEmail()
    const password = strongPassword()

    accountPage.visit()
    accountPage.register(email, password)

    cy.get('.woocommerce-MyAccount-content > :nth-child(2)').should('contain.text', 'Olá, usuario')
    cy.contains('a', /logout/i, { timeout: 15000 }).should('be.visible')
  })
})