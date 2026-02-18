class CartPage {
  seguirCheckout() {
    cy.get('a.checkout-button, a[href*="checkout"], a[href*="finalizar"]', { timeout: 20000 })
      .filter(':visible')
      .first()
      .click({ force: true });

    cy.location('pathname', { timeout: 20000 }).should('match', /checkout|finalizar|pagamento/i);
  }
}

module.exports = new CartPage();