function buildInitializeCheckoutService(
    addressService,
    cartService,
    customerService,
    orderService,
    quoteService,
    shippingMethodService
) {
    'ngInject';

    const service = {
        execute,
    };

    function execute() {
        return quoteService.fetchQuote()
            .then(resp => {
                const { cart, customer, order, quote, shippingOptions } = resp;

                addressService.setBillingAddress(quote.billingAddress);
                addressService.setShippingAddress(quote.shippingAddress);
                cartService.setCart(cart);
                cartService.setStoreCredit(customer.storeCredit);
                orderService.setOrder(order);
                customerService.setCustomer(customer);
                shippingMethodService.setShippingOptions(shippingOptions);

                return quote;
            });
    }

    return service;
}

angular.module('bigcommerce-checkout')
    .factory('initializeCheckoutService', buildInitializeCheckoutService);
