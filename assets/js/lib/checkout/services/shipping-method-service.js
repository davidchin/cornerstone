function buildShippingMethodService(
    _,
    $http,
    $q,
    API,
    ERRORS,
    cartService,
    quoteService
) {
    'ngInject';

    const service = {
        fetchShippingOptions,
        getSelectedShippingOptionId,
        getShippingOptionById,
        getShippingOption,
        hasShippingOptions,
        postShippingOption,
        setSelectedShippingOptionId,
        setShippingOptions,
    };

    let shippingOptions = {};

    function fetchShippingOptions() {
        return $http.get(API.SHIPPING_OPTIONS_URL)
            .then(resp => resp.data.data.shippingOptions)
            .then(service.setShippingOptions);
    }

    function getSelectedShippingOptionId() {
        return quoteService.getShippingOption();
    }

    function getShippingOption(shippingOptionId) {
        return shippingOptions[shippingOptionId];
    }

    function getShippingOptionById(addressId, selectedOptionId) {
        return _.findWhere(shippingOptions[addressId], { id: selectedOptionId });
    }

    function hasShippingOptions(addressId) {
        return shippingOptions[addressId] && shippingOptions[addressId].length;
    }

    function postShippingOption(addressId, shippingOptionId) {
        let data;

        return $http.put(API.SHIPPING_OPTIONS_URL, {
            addressId,
            shippingOptionId,
        }, { once: 'shippingOption' })
            .then(resp => data = resp.data.data)

            // update cart
            .then(() => data.cart)
            .then(cartService.setCart)

            // update quote
            .then(() => data.quote)
            .then(quoteService.setQuote)

            // set selected
            .then(() => data.quote.shippingOption)
            .then(service.setSelectedShippingOptionId)

            .catch(err => $q.reject(new ERRORS.SHIPPING_OPTION_FAILED(err)));
    }

    function setSelectedShippingOptionId(shippingOptionId = null) {
        return quoteService.setShippingOption(shippingOptionId);
    }

    function setShippingOptions(shippingOptionsToSet) {
        shippingOptions = shippingOptionsToSet;

        return shippingOptions;
    }

    return service;
}

angular.module('bigcommerce-checkout')
    .factory('shippingMethodService', buildShippingMethodService);
