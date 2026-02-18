class CheckoutPage {
  visit() {
    cy.visit('/checkout/');
    cy.location('pathname', { timeout: 20000 }).should('include', '/checkout');
  }

  preencherCobrança(billing) {
    cy.get('#billing_first_name', { timeout: 20000 }).clear().type(billing.firstName);
    cy.get('#billing_last_name').clear().type(billing.lastName);
    cy.get('#billing_address_1').clear().type(billing.address1);
    cy.get('#billing_city').clear().type(billing.city);
    cy.get('#billing_postcode').clear().type(billing.postcode);
    cy.get('#billing_phone').clear().type(billing.phone);
    cy.get('#billing_email').clear().type(billing.email);
  }

  aceiteDeTermos() {
    cy.get('body').then(($body) => {
      if ($body.find('#terms').length) {
        cy.get('#terms').then(($t) => {
          if (!$t.is(':checked')) cy.wrap($t).check({ force: true });
        });
      } else {
        const $alt = $body.find('input[type="checkbox"][name*="terms"], input[type="checkbox"][id*="terms"]');
        if ($alt.length) {
          cy.wrap($alt.first()).then(($t) => {
            if (!$t.is(':checked')) cy.wrap($t).check({ force: true });
          });
        }
      }
    });
  }

  selecionarPagemento() {
    cy.get('body').then(($body) => {
      const $payments = $body.find('input[name="payment_method"]');
      if ($payments.length) {
        const anyChecked = $payments.is(':checked');
        if (!anyChecked) {
          cy.wrap($payments.first()).check({ force: true });
        }
      }
    });
  }

  fazerPedido() {
    this.aceiteDeTermos();
    this.selecionarPagemento();

    cy.get('#place_order, button[name="woocommerce_checkout_place_order"]', { timeout: 20000 })
      .filter(':visible')
      .should('not.be.disabled')
      .click({ force: true });
  }

  assertOrderReceived() {
    cy.location('pathname', { timeout: 30000 }).should('match', /order-received|pedido-recebido/i);
    cy.contains(/pedido foi recebido|order received|obrigado/i, { timeout: 30000 }).should('be.visible');
  }
}

module.exports = new CheckoutPage();