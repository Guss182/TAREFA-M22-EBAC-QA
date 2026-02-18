/// <reference types="cypress" />

const productPage = require('../support/pages/productPage');

describe('M23 - Intercept WooCommerce (fragments)', () => {
  const FRAG = /wc-ajax=get_refreshed_fragments/i;

  const observar = (alias) => cy.intercept('POST', FRAG).as(alias);

  const validar = (i) => {
    expect(i.response?.statusCode).to.eq(200);
    expect(i.response?.body).to.have.property('fragments');
    expect(i.response?.body).to.have.property('cart_hash');
  };

  const adicionarItem = (alias) => {
    observar(alias);

    productPage.abrirEbacShop();
    productPage.abrirPrimeiroProduto(); // agora evita "outofstock"
    productPage.selecionarVariacao();      // tenta achar combinação disponível
    productPage.addCarrinho();

    cy.wait(`@${alias}`, { timeout: 20000 }).then(validar);
  };

  const irParaCarrinho = () => {
    cy.get('a[href*="/carrinho"], a.wc-forward, a.cart-contents', { timeout: 20000 })
      .filter(':visible')
      .first()
      .click({ force: true });

    cy.location('pathname', { timeout: 20000 }).should('include', '/carrinho');
  };

  it('ADICIONAR: valida fragments ao adicionar item', () => {
    adicionarItem('frAdd');
  });

  describe('com item no carrinho', () => {
    beforeEach(() => {
      adicionarItem('frBase');
      irParaCarrinho();
    });

    it('ATUALIZAR: valida fragments ao atualizar quantidade', () => {
      observar('frUpdate');

      cy.get('input.qty', { timeout: 20000 })
        .first()
        .clear({ force: true })
        .type('2', { force: true })
        .should('have.value', '2');

      // alguns temas têm botão, outros atualizam automaticamente
      cy.get('body').then(($b) => {
        const $update = $b.find('[name="update_cart"]:visible');
        if ($update.length) cy.wrap($update.first()).click({ force: true });
        else cy.get('input.qty').first().blur({ force: true });
      });

      cy.wait('@frUpdate', { timeout: 20000 }).then(validar);
    });

    it('REMOVER: valida fragments ao remover item', () => {
      observar('frRemove');

      cy.get('a.remove', { timeout: 20000 }).first().click({ force: true });

      cy.wait('@frRemove', { timeout: 20000 }).then(validar);
    });
  });

  it('STUB: simula resposta de fragments e valida body', () => {
    const stub = {
      fragments: { 'div.widget_shopping_cart_content': '<div><p>Stub Cart</p></div>' },
      cart_hash: 'stub_123',
    };

    cy.intercept('POST', FRAG, { statusCode: 200, body: stub }).as('frStub');

    productPage.abrirEbacShop();
    productPage.abrirPrimeiroProduto();
    productPage.selecionarVariacao();
    productPage.addCarrinho();

    cy.wait('@frStub').its('response.body').should('deep.equal', stub);
  });
});
