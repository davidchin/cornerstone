function buildPaymentService(
    $http,
    $interpolate,
    $q,
    $state,
    braintreePaypalService,
    PAYMENT_PROVIDER,
    paymentMethodService
) {
    const gatewayState = 'ng-checkout.checkout.payment.{{ gatewayId }}-{{ providerId }}';
    const paymentState = 'ng-checkout.checkout.payment.{{ providerId }}';
    const service = {
        getPaymentData,
        getPaymentProvider,
        isSubmitDisabled,
        isSubmitting,
        navigate,
        preparePayment,
        resetPaymentData,
        resetSubmit,
        setPaymentData,
        setPaymentProvider,
        setSubmit,
        submit,
    };

    let _isSubmitDisabled = false;
    let _isSubmitting = false;
    let paymentData = {};
    let paymentProviderId;
    let submitCallback;

    function preparePayment() {
        if (paymentProviderId === PAYMENT_PROVIDER.BRAINTREE_PAYPAL) {
            return braintreePaypalService.initializeCheckout();
        }

        return $q.when();
    }

    function getPaymentData() {
        return paymentData;
    }

    function getPaymentProvider() {
        return paymentMethodService.getPayment(paymentProviderId);
    }

    function isSubmitDisabled(value) {
        if (_.isBoolean(value)) {
            _isSubmitDisabled = value;
        }

        return _isSubmitDisabled;
    }

    function isSubmitting() {
        return _isSubmitting;
    }

    function navigate(provider) {
        const params = { providerId: provider.id };

        if (provider.gateway) {
            const stateName = $interpolate(gatewayState)({
                gatewayId: provider.gateway,
                providerId: provider.id,
            });

            return $state.go(stateName, params);
        }

        const stateName = $interpolate(paymentState)({ providerId: provider.id });

        return $state.go(stateName, params);
    }

    function resetPaymentData() {
        paymentData = {};
    }

    function resetSubmit() {
        submitCallback = null;
    }

    function setPaymentData(newPaymentData) {
        paymentData = newPaymentData;

        return paymentData;
    }

    function setPaymentProvider(provider) {
        paymentProviderId = provider.id;

        return provider;
    }

    function setSubmit(submitCb) {
        submitCallback = submitCb;

        return submitCallback;
    }

    function submit() {
        if (!submitCallback || service.isSubmitDisabled()) {
            return $q.reject();
        }

        _isSubmitting = true;

        return $q.when(submitCallback())
            .finally(() => _isSubmitting = false);
    }

    return service;
}

angular.module('bigcommerce-checkout')
    .factory('paymentService', buildPaymentService);
