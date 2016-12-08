export default function buildAddressService(
    $http,
    $q,
    API,
    ERRORS,
    addressValidationService,
    cartService,
    quoteService,
    shippingMethodService
) {
    'ngInject';

    const billingAddress = {};
    const shippingAddress = {};
    const service = {
        clearAddress,
        equivalent,
        fetchAddress,
        fetchBillingAddress,
        fetchShippingAddress,
        getBillingAddress,
        getShippingAddress,
        getShippingAddressId,
        hasBillingAddress,
        hasShippingAddress,
        isEmptyAddress,
        postAddress,
        postBillingAddress,
        postShippingAddress,
        shouldUseSameAddress,
        shouldSaveAddress,
        setBillingAddress,
        setShippingAddress,
    };
    let useSameAddress = true;
    let saveAddress = true;

    function clearAddress(address) {
        _.each(_.keys(address), key => delete address[key]);

        return address;
    }

    function equivalent(address1, address2) {
        const omitFields = ['id', 'isValid', 'type'];

        return angular.equals(
            _.omit(address1, omitFields),
            _.omit(address2, omitFields)
        );
    }

    function fetchAddress(url) {
        return $http.get(url)
            .then(resp => resp.data.data)
            .catch(function handleError(error) {
                throw new Error(error);
            });
    }

    function fetchBillingAddress() {
        return service.fetchAddress(API.BILLING_URL)
            .then(resp => resp.billingAddress)
            .then(service.setBillingAddress);
    }

    function fetchShippingAddress() {
        return service.fetchAddress(API.SHIPPING_URL)
            .then(resp => resp.shippingAddress)
            .then(service.setShippingAddress);
    }

    function getBillingAddress() {
        return billingAddress;
    }

    function getShippingAddress() {
        return shippingAddress;
    }

    function getShippingAddressId() {
        return shippingAddress.id;
    }

    function hasBillingAddress() {
        return addressValidationService.isValid(billingAddress);
    }

    function hasShippingAddress() {
        return addressValidationService.isValid(shippingAddress);
    }

    function isEmptyAddress(address = {}) {
        return _.isEmpty(address) || _.all(address, prop => _.isNull(prop));
    }

    function postAddress(url, address, options = {}) {
        return $http.post(url, address, options)
            .then(resp => resp.data.data);
    }

    function postBillingAddress(address, options = {}) {
        let data;

        return service.postAddress(API.BILLING_URL, address, options)
            .then(resp => data = resp)

            // update cart
            .then(() => data.cart)
            .then(cartService.setCart)

            // update quote
            .then(() => data.quote)
            .then(quoteService.setQuote)

            // update billingAddress
            .then(() => data.billingAddress)
            .then(service.setBillingAddress)
            .catch(function handlePostAddressError(err) {
                return $q.reject(new ERRORS.POST_BILLING_ADDRESS_FAILED(err));
            });
    }

    function postShippingAddress(address, options = {}) {
        let data;

        return service.postAddress(API.SHIPPING_URL, address, options)
            .then(resp => data = resp)

            // update cart
            .then(() => data.cart)
            .then(cartService.setCart)

            // update shipping options
            .then(() => data.shippingOptions)
            .then(shippingMethodService.setShippingOptions)

            // update quote
            .then(() => data.quote)
            .then(quoteService.setQuote)

            // update shipping address
            .then(() => data.shippingAddress)
            .then(service.setShippingAddress)
            .catch(function handlePostAddressError(err) {
                if (err.status === 0) {
                    return $q.reject(new ERRORS.REQUEST_CANCELLED(err));
                }

                return $q.reject(new ERRORS.POST_SHIPPING_ADDRESS_FAILED(err));
            });
    }

    function shouldUseSameAddress(useSame) {
        if (!_.isUndefined(useSame)) {
            useSameAddress = useSame;
        }

        return useSameAddress;
    }

    function shouldSaveAddress(save) {
        if (!_.isUndefined(save)) {
            saveAddress = save;
        }

        return saveAddress;
    }

    function setBillingAddress(newAddress = {}) {
        service.clearAddress(billingAddress);

        return _.extend(billingAddress, newAddress);
    }

    function setShippingAddress(newAddress = {}) {
        service.clearAddress(shippingAddress);

        return _.extend(shippingAddress, newAddress);
    }

    return service;
}
