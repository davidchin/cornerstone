export default function buildCheckout(
    $q,
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
        getData,
        getStatus,

        getCart,

        getCustomer,
        hasCustomer,
        continueAsGuest,
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
        hasPaymentMethod,
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

                if (checkout.getStatus().hasShippingMethod) {
                    return checkout.fetchPaymentMethods();
                }
            })
            .then(() => checkout.getData());
    }

    function getCart() {
        return cartService.getCart();
    }

    function getCustomer() {
        return customerService.getCustomer();
    }

    function getData() {
        return {
            billingAddress: checkout.getBillingAddress(),
            billingAddresses: checkout.getBillingAddresses(),
            billingCountries: checkout.getBillingCountries(),
            cart: checkout.getCart(),
            customer: checkout.getCustomer(),
            order: checkout.getOrder(),
            paymentMethod: checkout.getPaymentMethod(),
            paymentMethods: checkout.getPaymentMethods(),
            shippingAddress: checkout.getShippingAddress(),
            shippingAddresses: checkout.getShippingAddresses(),
            shippingCountries: checkout.getShippingCountries(),
            shippingMethod: checkout.getShippingMethod(),
            shippingMethods: checkout.getShippingMethods(),
            status: checkout.getStatus(),
        };
    }

    function getStatus() {
        return {
            hasCustomer: checkout.hasCustomer(),
            hasBillingAddress: checkout.hasBillingAddress(),
            hasShippingAddress: checkout.hasShippingAddress(),
            hasShippingMethod: checkout.hasShippingMethod(),
            hasPaymentMethod: checkout.hasPaymentMethod(),
        };
    }

    function hasCustomer() {
        return customerService.hasEmail();
    }

    function continueAsGuest(email) {
        return customerService.postCustomer({ email })
            .then(() => checkout.getCustomer());
    }

    function loginCustomer(details) {
        return customerService.postCustomer(details)
            .then(() => checkout.getCustomer());
    }

    function logoutCustomer() {
        return customerService.logout()
            .then(() => checkout.getCustomer());
    }

    function signUpCustomer(credentials) {
        return customerService.createAccount(credentials)
            .then(() => checkout.getCustomer());
    }

    function finalizeOrder(id) {
        return orderService.submitFinalOrder(id)
            .then(() => checkout.getOrder());
    }

    function getOrder() {
        return orderService.getOrder();
    }

    function shouldFinalizeOrder() {
        return orderService.shouldSubmitFinalOrder();
    }

    function submitOrder(paymentData) {
        const provider = paymentService.getPaymentProvider();

        paymentData = orderService.isPaymentDataRequired() ? paymentData : {};

        return paymentService.preparePayment()
            .then(extraPaymentData => {
                paymentData = _.assign({}, paymentData, extraPaymentData);

                return cartService.verifyCart();
            })
            .then(() => orderService.submitOrder(provider.id, paymentData))
            .then(() => checkout.getOrder());
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
        const billingAddresses = checkout.getBillingAddresses();

        return addressService.selectBillingAddress(billingAddresses, id)
            .then(() => checkout.getBillingAddress());
    }

    function submitBillingAddress(address) {
        return addressService.postBillingAddress(address)
            .then(() => checkout.getBillingAddress());
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
        const shippingAddresses = checkout.getShippingAddresses();

        return addressService.selectShippingAddress(shippingAddresses, id)
            .then(() => checkout.getShippingAddress());
    }

    function submitShippingAddress(address) {
        return addressService.postShippingAddress(address)
            .then(() => checkout.getShippingAddress());
    }

    function configurePaymentMethod(config) {
        const paymentMethod = paymentService.getPaymentProvider();

        return paymentMethodService.configurePayment(paymentMethod.id, config)
            .then(() => checkout.getPaymentMethod());
    }

    function fetchPaymentMethods() {
        return paymentMethodService.fetchPayments();
    }

    function hasPaymentMethod() {
        return !!checkout.getPaymentMethod();
    }

    function getPaymentMethod() {
        return paymentService.getPaymentProvider();
    }

    function getPaymentMethods() {
        return paymentMethodService.getPayments();
    }

    function selectPaymentMethod(id) {
        const paymentMethod = paymentMethodService.getPayment(id);

        return $q.when(paymentService.setPaymentProvider(paymentMethod))
            .then(() => checkout.getPaymentMethod());
    }

    function fetchShippingMethods() {
        let test = shippingMethodService.fetchShippingOptions();
        debugger;
        return test;
    }

    function getShippingMethod() {
        const addressId = addressService.getShippingAddressId();

        return shippingMethodService.getSelectedShippingOption(addressId);
    }

    function getShippingMethods() {
        const addressId = addressService.getShippingAddressId();

        return shippingMethodService.getShippingOption(addressId);
    }

    function hasShippingMethod() {
        return quoteService.hasShippingOption();
    }

    function selectShippingMethod(id) {
        const addressId = addressService.getShippingAddressId();

        return shippingMethodService.postShippingOption(addressId, id)
            .then(() => checkout.getShippingMethod());
    }

    function applyCoupon(code) {
        return redeemableService.applyRedeemable(code)
            .then(cart => cartService.setCart(cart))
            .then(() => checkout.getCart());
    }

    function removeCoupon(code) {
        return redeemableService.removeRedeemable(code)
            .then(cart => cartService.setCart(cart))
            .then(() => checkout.getCart());
    }

    function applyGiftCertificate(code) {
        return redeemableService.applyRedeemable(code)
            .then(cart => cartService.setCart(cart))
            .then(() => checkout.getCart());
    }

    function removeGiftCertificate(code) {
        return redeemableService.removeRedeemable(code)
            .then(cart => cartService.setCart(cart))
            .then(() => checkout.getCart());
    }

    function applyStoreCredit() {
        return $q.when(customerService.setUsingStoreCredit(true))
            .then(() => checkout.getCart());
    }

    function removeStoreCredit() {
        return $q.when(customerService.setUsingStoreCredit(false))
            .then(() => checkout.getCart());
    }

    return checkout;
}
