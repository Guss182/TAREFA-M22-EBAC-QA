/// <reference types="cypress" />

const loginPage = require('../support/pages/loginPage');

describe('Login - Minha Conta (V1)', () => {
  it('deve fazer login com sucesso', () => {
    const user = {
      email: '123@123.com',
      senha: '1234@abcd',
      remember: false,
    };

    loginPage.visit();
    loginPage.login(user);
    loginPage.assertLoggedIn();
  });
});