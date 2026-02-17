class ProductPage {
  openShop() {
    cy.visit('/produtos/');
    cy.get('div.products, ul.products, div.products.products-grid', { timeout: 20000 })
      .should('be.visible');
  }

  openFirstProductFromGrid() {
    cy.get('a[href*="/product/"]', { timeout: 20000 })
      .filter(':visible')
      .first()
      .click();

    cy.location('pathname', { timeout: 20000 }).should('include', '/product/');
  }

  selectAnyVariations() {
    cy.get('body').then(($body) => {
      const sizeLabel = [...$body.find('td.label')].find((el) =>
        /size|tamanho/i.test((el.innerText || '').trim())
      );

      if (sizeLabel) {
        cy.wrap(sizeLabel)
          .parents('tr')
          .first()
          .within(() => {
            cy.get('li.variable-item.button-variable-item', { timeout: 15000 })
              .not('.disabled')
              .filter(':visible')
              .first()
              .click({ force: true });
          });
      }
    });

    cy.get('body').then(($body) => {
      const colorLabel = [...$body.find('td.label')].find((el) =>
        /color|cor/i.test((el.innerText || '').trim())
      );

      if (colorLabel) {
        cy.wrap(colorLabel)
          .parents('tr')
          .first()
          .within(() => {
            cy.get('li.variable-item.button-variable-item', { timeout: 15000 })
              .not('.disabled')
              .filter(':visible')
              .first()
              .click({ force: true });
          });
      }
    });

    cy.get('input.variation_id', { timeout: 20000 })
      .should('exist')
      .then(($vid) => {
        const v = $vid.val();
        if (v && v !== '0') return;

        cy.log('Fallback: variation_id ainda 0, setando selects escondidos');

        cy.get('body').then(($body) => {
          const sizeVal = $body
            .find('td.label')
            .filter((_, el) => /size|tamanho/i.test((el.innerText || '').trim()))
            .closest('tr')
            .find('li.variable-item.button-variable-item.selected')
            .first()
            .attr('data-value');

          const colorVal = $body
            .find('td.label')
            .filter((_, el) => /color|cor/i.test((el.innerText || '').trim()))
            .closest('tr')
            .find('li.variable-item.button-variable-item.selected')
            .first()
            .attr('data-value');

          if (sizeVal) {
            cy.get(`select[name^="attribute_"][name*="size"]`, { timeout: 15000 })
              .first()
              .select(sizeVal, { force: true })
              .trigger('change', { force: true });
          }

          if (colorVal) {
            cy.get(`select[name^="attribute_"][name*="color"]`, { timeout: 15000 })
              .first()
              .select(colorVal, { force: true })
              .trigger('change', { force: true });
          }
        });
      });

    cy.get('input.variation_id', { timeout: 20000 }).should(($el) => {
      const v2 = $el.val();
      expect(v2, 'variation_id preenchido').to.not.be.oneOf(['', '0', null, undefined]);
    });
  }

  addToCart() {
    cy.get(
      'button.single_add_to_cart_button, button[name="add-to-cart"], .single_add_to_cart_button',
      { timeout: 20000 }
    )
      .filter(':visible')
      .should('not.have.class', 'disabled')
      .click({ force: true });
  }

  goToCartFromNotice() {
    cy.contains('a', /ver carrinho|view cart/i, { timeout: 20000 })
      .click({ force: true });

    cy.location('pathname', { timeout: 20000 }).should('include', '/carrinho');
  }
}

module.exports = new ProductPage();