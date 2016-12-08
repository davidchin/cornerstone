function buildOrderService(
    _,
    API,
    gettextCatalog,
    $http,
    $q,
    bigpayPaymentService,
    cartService,
    ERRORS,
    PAYMENT_PROVIDER,
    PAYMENT_STATUS,
    apiErrorsService,
    customerService,
    paymentMethodService,
    paymentService
) {
    'ngInject';

    const order = {};
    const service = {
        completeOrder,
        fetchOrder,
        getOrder,
        isComplete,
        isPaymentRequired,
        sendOrder,
        sendFinalOrder,
        setOrder,
        shouldSubmitFinalOrder,
        isPaymentDataRequired,
        submitOrder,
        submitFinalOrder,
    };

    function completeOrder() {
        order.isComplete = true;
    }

    function fetchOrder(id, token) {
        return $http.get(`${API.ORDER_URL}/${id}`, { token })
            .then(resp => service.setOrder(resp.data.data.order));
    }

    function getOrder() {
        return order;
    }

    function getPaymentStatus() {
        const order = service.getOrder();

        if (!order.payment) {
            return;
        }

        return order.payment.status;
    }

    /**
     * Attempt to match the order error by error type
     * @param  {object} err
     * @return {promise} rejected promise
     */
    function handleError(err) {
        let errorData;
        let errorType;
        let providerMessage;
        let thirdPartyErrorMessage;

        try {
            const providerErrorMessagePrefix = gettextCatalog.getString('Response from payment provider:');

            errorData = err.data;
            errorType = _.last(errorData.type.split('/'));
            providerMessage = _.isArray(errorData.errors) ? errorData.errors.join(' ') : null;
            thirdPartyErrorMessage = providerMessage ? `${providerErrorMessagePrefix} ${providerMessage}` : '';
        } catch (error) {
            return $q.reject(err);
        }

        if (apiErrorsService.isFatalError(errorType)) {
            return $q.reject(new ERRORS.ORDER_FATAL_ERROR(err, errorData.detail));
        }

        if (apiErrorsService.isFatalThirdPartyError(errorType)) {
            return $q.reject(new ERRORS.ORDER_FATAL_ERROR(err, thirdPartyErrorMessage));
        }

        if (apiErrorsService.isRecoverableError(errorType)) {
            return $q.reject(new ERRORS.ORDER_RECOVERABLE_ERROR(err, errorData.detail));
        }

        if (apiErrorsService.isRecoverableThirdPartyError(errorType)) {
            return $q.reject(new ERRORS.ORDER_RECOVERABLE_ERROR(err, thirdPartyErrorMessage));
        }

        return $q.reject(err);
    }

    function hasPaymentNonce() {
        const paymentProvider = paymentService.getPaymentProvider();

        if (paymentProvider && paymentProvider.nonce) {
            return true;
        }

        return false;
    }

    /**
     * Returns whether the order has been completed.
     * @return {boolean}
     */
    function isComplete() {
        return !!order.isComplete;
    }

    function sendFinalOrder(orderId) {
        return $http.post(API.ORDER_URL + '/' + orderId, {});
    }

    function sendOrder(paymentProviderId, paymentData) {
        const paymentProvider = paymentMethodService.getPayment(paymentProviderId);
        const payload = {
            customerMessage: order.customerMessage,
            useStoreCredit: customerService.getUsingStoreCredit(),
            payment: {
                name: paymentProviderId,
                paymentData,
            },
        };

        if (paymentProvider && paymentProvider.gateway) {
            payload.payment.gateway = paymentProvider.gateway;
        }

        if (shouldExcludePayment(paymentProvider)) {
            delete payload.payment;
        }

        return $http.post(API.ORDER_URL, payload);
    }

    function sendPayment(authToken, payment) {
        const order = service.getOrder();

        return bigpayPaymentService.submitPayment(authToken, order, payment);
    }

    function isPaymentAcknowledged() {
        return getPaymentStatus() === PAYMENT_STATUS.ACKNOWLEDGE;
    }

    function isPaymentFinalized() {
        return getPaymentStatus() === PAYMENT_STATUS.FINALIZE;
    }

    function isPaymentDataRequired(options) {
        // If payment data has been acknowledged already, payment data is not required
        if (hasPaymentNonce() || isPaymentAcknowledged() || isPaymentFinalized()) {
            return false;
        }

        return service.isPaymentRequired(options);
    }

    function isPaymentRequired({ useStoreCredit = customerService.getUsingStoreCredit() } = {}) {
        const order = service.getOrder();

        if (order.grandTotal && _.isNumber(order.grandTotal.integerAmount)) {
            return order.grandTotal.integerAmount > 0;
        }

        return cartService.getPaidTotal(useStoreCredit) > 0;
    }

    function initializeOffsitePayment(authToken, payment) {
        const order = service.getOrder();

        return bigpayPaymentService.initializeOffsitePayment(authToken, order, payment);
    }

    function setOrder(orderToSet) {
        if (!orderToSet) {
            return order;
        }

        return _.extend(order, orderToSet);
    }

    function shouldSubmitFinalOrder() {
        const order = service.getOrder();

        if (order.orderId) {
            return isPaymentAcknowledged() || isPaymentFinalized();
        }

        return false;
    }

    function shouldExcludePayment(provider) {
        if (!provider) {
            return false;
        }

        return shouldSubmitToBigpay(provider.id) && provider.gateway !== PAYMENT_PROVIDER.ADYEN;
    }

    function shouldSubmitToBigpay(providerId) {
        return bigpayPaymentService.isEnabledForProvider(providerId) &&
               service.isPaymentRequired() &&
               !isPaymentAcknowledged() &&
               !isPaymentFinalized();
    }

    function submitOrder(providerId, paymentData = {}) {
        return service.sendOrder(providerId, paymentData)
            .then(resp => {
                const { data } = resp.data;
                const authToken = resp.headers('token');

                service.setOrder(data.order);
                customerService.setCustomer(data.customer);

                if (shouldSubmitToBigpay(providerId)) {
                    if (paymentMethodService.isHostedPayment(providerId)) {
                        return initializeOffsitePayment(authToken, paymentData);
                    }

                    return sendPayment(authToken, paymentData);
                }
            })
            .then(() => {
                const order = service.getOrder();

                if (shouldSubmitToBigpay(providerId)) {
                    return service.fetchOrder(order.orderId, order.token);
                }

                return order;
            })
            .then(order => {
                service.completeOrder();

                return order;
            })
            .catch(handleError);
    }

    function submitFinalOrder(orderId) {
        return service.sendFinalOrder(orderId)
            .then(resp => {
                const { data } = resp.data;

                customerService.setCustomer(data.customer);
                service.setOrder(data.order);
                service.completeOrder();

                return service.getOrder();
            })
            .catch(handleError);
    }

    return service;
}

angular.module('bigcommerce-checkout')
    .factory('orderService', buildOrderService);
