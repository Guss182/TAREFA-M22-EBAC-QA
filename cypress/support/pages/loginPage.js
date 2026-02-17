class LoginPage {
  visit() {
    cy.visit('/minha-conta/');
  }

  usernameInput() {
    return cy.get('#username');
  }

  passwordInput() {
    return cy.get('#password');
  }

  rememberMeCheckbox() {
    return cy.get('#rememberme');
  }

  loginButton() {
    return cy.get('input[name="login"]');
  }
  fillUsername(usernameOrEmail) {
    this.usernameInput().clear().type(usernameOrEmail);
  }

  fillPassword(password) {
    this.passwordInput().clear().type(password, { log: false });
  }

  toggleRememberMe(enable = true) {
    if (enable) this.rememberMeCheckbox().check();
    else this.rememberMeCheckbox().uncheck();
  }

  submit() {
    this.loginButton().click();
  }

  login(user) {
    this.fillUsername(user.email);
    this.fillPassword(user.senha);
    if (user.remember) this.toggleRememberMe(true);
    this.submit();
  }

  assertLoggedIn() {
    cy.get('.woocommerce-MyAccount-navigation', { timeout: 15000 }).should('be.visible');
    cy.contains(/logout|sair/i).should('be.visible');
  }
}

module.exports = new LoginPage();