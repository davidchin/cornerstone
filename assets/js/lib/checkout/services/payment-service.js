export default function buildPaymentService(
    $http,
    $q,
    braintreePaypalService,
    PAYMENT_PROVIDER,
    paymentMethodService
) {
    'ngInject';

    const gatewayState = 'ng-checkout.checkout.payment.{{ gatewayId }}-{{ providerId }}';
    const paymentState = 'ng-checkout.checkout.payment.{{ providerId }}';
    const service = {
        getPaymentData,
        getPaymentProvider,
        isSubmitDisabled,
        isSubmitting,
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
            return braintreePaypalService.initializeCheckout()
                .then(response => {
                    braintreePaypalService.teardownSdk();

                    return response;
                });
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
