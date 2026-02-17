/// <reference types="cypress" />

const loginPage = require('../support/pages/loginPage');
const checkoutActions = require('../support/appActions/CheckoutActions');

describe('Checkout (Actions) - V1', () => {
  it('deve finalizar compra usando Actions', () => {
    const user = {
      email: '123@123.com',
      senha: '1234@abcd',
      remember: false,
    };

    const billing = {
      firstName: 'Gustavo',
      lastName: 'Teste',
      address1: 'Rua QA, 123',
      city: 'São Paulo',
      postcode: '01001000',
      phone: '11999999999',
      email: user.email,
    };
    
    loginPage.visit();
    loginPage.login(user);
    checkoutActions.buyRandomProductAndCheckout(billing);
  });
});