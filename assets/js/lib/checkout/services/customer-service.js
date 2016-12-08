function buildCustomerService(
    _,
    $http,
    $q,
    API,
    REMOTE_METHOD,
    ERRORS,
    addressService,
    cartService,
    quoteService,
    shippingMethodService
) {
    'ngInject';

    const canonicalCustomer = {};
    const customer = {
        addresses: [],
        isGuest: true,
        remote: {}
    };

    const service = {
        createAccount,
        fetchCustomer,
        getAddresses,
        getBillingMessage,
        getCanonical,
        getCustomer,
        getStoreCredit,
        getUsingStoreCredit,
        hasAddress,
        hasAddresses,
        hasBillingMessage,
        hasEmail,
        hasFixedBillingAddress,
        hasRemotePaymentMethod,
        hasRemoteShippingAddress,
        isFixed,
        isReturning,
        logout,
        postCustomer,
        setCanonical,
        setCheckoutData,
        setCustomer,
        setUsingStoreCredit,
        getRemoteProviderName,
    };

    let useStoreCredit = true;

    function createAccount(accountInfo) {
        return $http.put(API.ACCOUNT_URL, accountInfo)
            .then(resp => resp.data.data)
            .catch(err => $q.reject(new ERRORS.ACCOUNT_CREATION_FAILED(err)));
    }

    function fetchCustomer() {
        return $http.get(API.CUSTOMER_URL)
            .then(resp => resp.data.data)
            .then(resp => resp.customer)
            .then(service.setCustomer);
    }

    function getAddresses() {
        return customer.addresses;
    }

    function setUsingStoreCredit(useCredit) {
        useStoreCredit = useCredit;

        return useStoreCredit;
    }

    function getUsingStoreCredit() {
        return !canonicalCustomer.isGuest ? useStoreCredit : false;
    }

    /**
     * Return the canonical customer object that always matches the customer object held on the server
     * and not the local copy on the client side.
     *
     * @return {object} customer object
     */
    function getCanonical() {
        return canonicalCustomer;
    }

    function getCustomer() {
        return customer;
    }

    /**
     * Return a billing step message to be presented to the shopper
     *
     * @returns {*}
     */
    function getBillingMessage() {
        if (customer.remote && customer.remote.billingMessage) {
            return customer.remote.billingMessage;
        }

        return '';
    }

    /**
     * Get customer remote provider name if any
     *
     * @returns {string}
     */
    function getRemoteProviderName() {
        if (customer.remote && customer.remote.provider) {
            return customer.remote.provider;
        }

        return '';
    }

    function getStoreCredit() {
        return canonicalCustomer.storeCredit || 0;
    }

    function hasAddress(address) {
        const omitFields = ['id', 'isValid', 'type'];
        const updatedAddress = _.omit(address, omitFields);

        return _.any(service.getAddresses(), existingAddress => {
            return angular.equals(_.omit(existingAddress, omitFields), updatedAddress);
        });
    }

    /**
     * Does the customer have addresses associated with the account?
     *
     * @return {boolean}
     */
    function hasAddresses() {
        return !_.isEmpty(service.getAddresses());
    }

    /**
     * @returns {boolean}
     */
    function hasBillingMessage() {
        return service.getBillingMessage().length > 0;
    }

    /**
     * @returns {boolean}
     */
    function hasEmail() {
        return !_.isEmpty(customer.email);
    }

    /**
     * Does the customer have a fixed billing address (ie. from a remote provider)?
     *
     * @returns {boolean}
     */
    function hasFixedBillingAddress() {
        if (customer.remote) {
            return customer.remote.billing === REMOTE_METHOD.FIXED;
        }

        return false;
    }

    /**
     * Will the customer select a payment method from a remote provider?
     *
     * @returns {boolean}
     */
    function hasRemotePaymentMethod() {
        if (customer.remote) {
            return customer.remote.payment === REMOTE_METHOD.WIDGET;
        }

        return false;
    }

    /**
     * Will the customer select a shipping address from a remote provider?
     *
     * @returns {boolean}
     */
    function hasRemoteShippingAddress() {
        if (customer.remote) {
            return customer.remote.shipping === REMOTE_METHOD.WIDGET;
        }

        return false;
    }

    /**
     * Is the customer data unable to be modified during an in-progress checkout?
     *
     * @returns {boolean}
     */
    function isFixed() {
        if (customer.remote) {
            return customer.remote.customer === REMOTE_METHOD.FIXED;
        }

        return false;
    }

    function isReturning(returning) {
        if (!_.isUndefined(returning)) {
            customer.isGuest = !returning;
        }

        return !customer.isGuest;
    }

    function logout() {
        return $http.delete(API.CUSTOMER_URL)
            .then(resp => {
                customer.password = null; // Manually unset password, otherwise it won't be overridden

                return service.setCheckoutData(resp.data.data);
            })
            .catch(err => $q.reject(new ERRORS.SIGN_OUT_FAILED(err)));
    }

    function postCustomer(customer) {
        return $http.post(API.CUSTOMER_URL, customer)
            .then(resp => service.setCheckoutData(resp.data.data))
            .catch(err => {
                const errorData = err.data || {};
                const errorType = _.last(errorData.type.split('/'));

                if (errorType === 'throttled_login') {
                    return $q.reject(new ERRORS.SIGN_IN_THROTTLED(err));
                } else {
                    return $q.reject(new ERRORS.SIGN_IN_FAILED(err));
                }
            });
    }

    function setCheckoutData(checkoutData) {
        const { cart = {}, customer = {}, quote = {}, shippingOptions = {} } = checkoutData;

        // Set customer
        service.setCustomer(customer);

        // Set shipping & billing address
        addressService.setBillingAddress(quote.billingAddress);
        addressService.setShippingAddress(quote.shippingAddress);

        // Set cart
        cartService.setCart(cart);

        // Set store credit
        cartService.setStoreCredit(customer.storeCredit);

        // Set quote
        quoteService.setQuote(quote);

        // Set shipping options
        shippingMethodService.setShippingOptions(shippingOptions);

        return checkoutData;
    }

    /**
     * Extend the canonical customer object. This object should always match the canonical customer object held on the server
     * and not the local copy on the client side.
     *
     * @param customer {object} customer object
     * @return {object} customer object
     */
    function setCanonical(customer = {}) {
        _.extend(canonicalCustomer, customer);

        return canonicalCustomer;
    }

    function setCustomer(customerToSet) {
        service.setCanonical(customerToSet);

        return _.extend(customer, customerToSet);
    }

    return service;
}

angular.module('bigcommerce-checkout')
    .factory('customerService', buildCustomerService);
