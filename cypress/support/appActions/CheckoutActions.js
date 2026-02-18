const productPage = require('../pages/productPage');
const checkoutPage = require('../pages/checkoutPage');

class CheckoutActions {
  buyRandomProductAndCheckout(billing, quantity = 1) {
    productPage.abrirEbacShop();
    productPage.abrirPrimeiroProduto();
    productPage.selecionarVariacao();
    productPage.escolherQuantidade(quantity);
    productPage.addCarrinho();

    // ✅ garante que o produto foi realmente adicionado antes de navegar
    cy.get('.woocommerce-message, .woocommerce-notices-wrapper', { timeout: 20000 })
      .should('be.visible');

    // ✅ menor caminho: vai direto pro checkout (evita depender de botão/link do carrinho)
    cy.visit('/checkout/');
    cy.location('pathname', { timeout: 20000 }).should('include', '/checkout');

    checkoutPage.preencherCobrança(billing);
    checkoutPage.aceiteDeTermos();
    checkoutPage.fazerPedido();
    checkoutPage.assertOrderReceived();
  }
}

module.exports = new CheckoutActions();