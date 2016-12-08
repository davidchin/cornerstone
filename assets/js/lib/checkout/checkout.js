function createCheckout(
    addressService,
    cartService,
    configService,
    countryService,
    customerService,
    orderService,
    paymentMethodService,
    paymentService,
    quoteService,
    redeemableService,
    shippingMethodService
) {
    'ngInject';

    const checkout = {
        initialize,

        getCustomer,
        hasCustomer,
        loginCustomer,
        logoutCustomer,
        signUpCustomer,

        finalizeOrder,
        getOrder,
        shouldFinalizeOrder,
        submitOrder,

        getBillingAddress,
        getBillingAddresses,
        getBillingCountries,
        hasBillingAddress,
        selectBillingAddress,
        submitBillingAddress,

        getShippingAddress,
        getShippingAddresses,
        getShippingCountries,
        hasShippingAddress,
        selectShippingAddress,
        submitShippingAddress,

        configurePaymentMethod,
        fetchPaymentMethods,
        getPaymentMethod,
        getPaymentMethods,
        selectPaymentMethod,

        fetchShippingMethods,
        getShippingMethod,
        getShippingMethods,
        hasShippingMethod,
        selectShippingMethod,

        applyCoupon,
        removeCoupon,
        applyGiftCertificate,
        removeGiftCertificate,
        applyStoreCredit,
        removeStoreCredit,
    };

    function initialize() {
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

    function getCustomer() {
        return customerService.getCustomer();
    }

    function hasCustomer() {
        return customerService.hasEmail();
    }

    function loginCustomer(credentials) {
        return customerService.postCustomer(credentials);
    }

    function logoutCustomer() {
        return customerService.logout();
    }

    function signUpCustomer(credentials) {
        return customerService.createAccount(credentials);
    }

    function finalizeOrder(id) {
        return orderService.submitFinalOrder(id);
    }

    function getOrder() {
        return orderService.getOrder();
    }

    function shouldFinalizeOrder() {
        return orderService.shouldSubmitFinalOrder();
    }

    function submitOrder(providerId, paymentData) {
        paymentData = orderService.isPaymentDataRequired() ? paymentData : {};

        paymentService.setPaymentData(paymentData);

        return paymentService.preparePayment()
            .then(() => cartService.verifyCart())
            .then(() => orderService.submitOrder(providerId, paymentData));
    }

    function getBillingAddress() {
        return addressService.getBillingAddress();
    }

    function getBillingAddresses() {
        return customerService.getAddresses();
    }

    function getBillingCountries() {
        return countryService.getCountries();
    }

    function hasBillingAddress() {
        return addressService.hasBillingAddress();
    }

    function selectBillingAddress(id) {
        return addressService.selectBillingAddress(checkout.getBillingAddresses(), id);
    }

    function submitBillingAddress(address) {
        return addressService.postBillingAddress(address);
    }

    function getShippingAddress() {
        return addressService.getShippingAddress();
    }

    function getShippingAddresses() {
        return customerService.getAddresses();
    }

    function getShippingCountries() {
        return countryService.getShippingCountries();
    }

    function hasShippingAddress() {
        return addressService.hasShippingAddress();
    }

    function selectShippingAddress(id) {
        return addressService.selectShippingAddress(checkout.getShippingAddresses(), id);
    }

    function submitShippingAddress(address) {
        return addressService.postShippingAddress(address);
    }

    function configurePaymentMethod() {
        const paymentMethod = paymentService.getPaymentProvider();

        return paymentMethodService.configurePayment(paymentMethod.id);
    }

    function fetchPaymentMethods() {
        return paymentMethodService.fetchPayments();
    }

    function getPaymentMethod() {
        return paymentService.getPaymentProvider();
    }

    function getPaymentMethods() {
        return paymentMethodService.getPayments();
    }

    function selectPaymentMethod(id) {
        const paymentMethod = paymentMethodService.getPayment(id);

        return paymentService.setPaymentProvider(paymentMethod);
    }

    function fetchShippingMethods() {
        return shippingMethodService.fetchShippingOptions();
    }

    function getShippingMethod() {
        return shippingMethodService.getSelectedShippingOption();
    }

    function getShippingMethods() {
        return shippingMethodService.getShippingOption(addressService.getShippingAddressId());
    }

    function hasShippingMethod() {
        return quoteService.hasShippingOption();
    }

    function selectShippingMethod(id) {
        return shippingMethodService.postShippingOption(addressService.getShippingAddressId(), id);
    }

    function applyCoupon(code) {
        return redeemableService.applyRedeemable(code)
            .then(cart => cartService.setCart(cart));
    }

    function removeCoupon(code) {
        return redeemableService.removeRedeemable(code)
            .then(cart => cartService.setCart(cart));
    }

    function applyGiftCertificate(code) {
        return redeemableService.applyRedeemable(code)
            .then(cart => cartService.setCart(cart));
    }

    function removeGiftCertificate(code) {
        return redeemableService.removeRedeemable(code)
            .then(cart => cartService.setCart(cart));
    }

    function applyStoreCredit() {
        return customerService.setUsingStoreCredit(true);
    }

    function removeStoreCredit() {
        return customerService.setUsingStoreCredit(false);
    }

    return checkout;
}

angular.module('bigcommerce-checkout')
    .factory('checkout', createCheckout);
