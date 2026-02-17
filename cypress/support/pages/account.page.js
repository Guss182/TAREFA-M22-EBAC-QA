class AccountPage {
  visit() {
    cy.visit('/minha-conta/')
  }

  regEmail() {
    return cy.get('#reg_email')
  }

  regPassword() {
    return cy.get('#reg_password')
  }

  btnRegister() {
    return cy.get(':nth-child(4) > .button')
  }

  register(email, password) {
    this.regEmail().should('be.visible').clear().type(email)
    this.regPassword().should('be.visible').clear().type(password, { log: false })
    this.btnRegister().should('be.visible').click()
  }
}

module.exports = new AccountPage()