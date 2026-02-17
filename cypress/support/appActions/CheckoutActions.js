const productPage = require('../pages/productPage');
const cartPage = require('../pages/cartPage');
const checkoutPage = require('../pages/checkoutPage');

class CheckoutActions {
  buyRandomProductAndCheckout(billing) {
    productPage.openShop();
    productPage.openFirstProductFromGrid();
    productPage.selectAnyVariations();
    productPage.addToCart();
    productPage.goToCartFromNotice();
    cartPage.proceedToCheckout();
    checkoutPage.fillBilling(billing);
    checkoutPage.placeOrder();
    checkoutPage.assertOrderReceived();
  }
}

module.exports = new CheckoutActions();