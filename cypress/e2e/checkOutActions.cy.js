/// <reference types="cypress" />

const { faker } = require('@faker-js/faker');
const { uniquePhone } = require('../support/utils');

const loginPage = require('../support/pages/loginPage');
const checkoutActions = require('../support/appActions/CheckoutActions');

describe('Checkout (Actions)', () => {
  it('deve finalizar compra usando Actions', () => {
    const user = {
      email: '123@123.com',
      senha: '1234@abcd',
      remember: false,
    };

    const quantity = faker.number.int({ min: 1, max: 3 });

    const billing = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      address1: faker.location.streetAddress(),
      city: faker.location.city(),
      postcode: faker.location.zipCode('########'),
      phone: uniquePhone(),
      // pode ser diferente do login; aqui é só o e-mail de cobrança
      email: faker.internet.email().toLowerCase(),
    };

    loginPage.visit();
    loginPage.login(user);
    checkoutActions.buyRandomProductAndCheckout(billing, quantity);
  });
});