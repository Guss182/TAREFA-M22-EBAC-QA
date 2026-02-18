class ProductPage {
  abrirEbacShop() {
    cy.visit('/produtos/');
    cy.get('div.products, ul.products, .products', { timeout: 20000 }).should('be.visible');
  }

  abrirPrimeiroProduto() {
    // pega o primeiro produto VISÍVEL que NÃO esteja marcado como "outofstock" (quando existir)
    cy.get(
      '.products a.woocommerce-LoopProduct-link, .products a.woocommerce-loop-product__link, .products a[href*="/product/"], .products a[href*="/produto/"]',
      { timeout: 20000 }
    )
      .filter(':visible')
      .then(($links) => {
        const links = [...$links];

        const escolhido = links.find((a) => {
          const card = a.closest('li.product, .product');
          return card && !card.classList.contains('outofstock');
        });

        if (!escolhido) {
          throw new Error('Não achei nenhum produto com estoque na listagem.');
        }

        cy.wrap(escolhido).click({ force: true });
      });

    // aceita /product/ e /produto/ (varia conforme o tema)
    cy.location('pathname', { timeout: 20000 }).should('match', /\/(product|produto)\//);
  }

  selecionarVariacao(retries = 3) {
    cy.get('body').then(($body) => {
      if (!$body.find('form.variations_form').length) return;

      const pickRandom = ($sel) => {
        const opts = [...$sel.find('option')];
        const values = opts
          .filter((o) => o.value && o.value !== '' && !o.disabled)
          .map((o) => o.value);

        if (!values.length) return;

        const value = values[Math.floor(Math.random() * values.length)];
        cy.wrap($sel).select(value, { force: true }).trigger('change', { force: true });
      };

      cy.get('form.variations_form select').each(($sel) => pickRandom($sel));

      // valida: variation_id preenchido + botão de compra habilitado
      cy.get('input.variation_id', { timeout: 20000 })
        .invoke('val')
        .then((v) => {
          const id = String(v || '').trim();
          const hasId = /^\d+$/.test(id) && id !== '0';

          cy.get('button.single_add_to_cart_button, button[name="add-to-cart"]', { timeout: 20000 }).then(
            ($btn) => {
              const disabled =
                $btn.is(':disabled') ||
                $btn.hasClass('disabled') ||
                $btn.hasClass('wc-variation-is-unavailable');

              if (hasId && !disabled) return;

              if (retries <= 0) {
                throw new Error('Não consegui selecionar uma variação disponível para compra.');
              }

              if ($body.find('a.reset_variations').length) {
                cy.get('a.reset_variations').click({ force: true });
              }

              // tenta novamente com outra combinação
              this.selecionarVariacao(retries - 1);
            }
          );
        });
    });
  }

  escolherQuantidade(qty) {
    cy.get('input.qty, input[name="quantity"]', { timeout: 20000 })
      .first()
      .clear({ force: true })
      .type(String(qty), { force: true })
      .should('have.value', String(qty));
  }

  addCarrinho() {
    cy.get('button.single_add_to_cart_button, button[name="add-to-cart"]', { timeout: 20000 })
      .should(($btn) => {
        const disabled =
          $btn.is(':disabled') ||
          $btn.hasClass('disabled') ||
          $btn.hasClass('wc-variation-is-unavailable');

        expect(disabled, 'botão Comprar habilitado').to.eq(false);
      })
      .click({ force: true });

    // garante feedback de carrinho (como foi feito em aula)
    cy.get('.woocommerce-message, .woocommerce-notices-wrapper', { timeout: 20000 }).should('be.visible');
  }
}

module.exports = new ProductPage();
