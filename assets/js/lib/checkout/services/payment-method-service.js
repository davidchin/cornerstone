export default function buildPaymentMethodService(
    $http,
    $q,
    API,
    braintreePaypalService,
    PAYMENT_PROVIDER,
    PAYMENT_TYPE
) {
    'ngInject';

    const payments = [];
    const service = {
        configurePayment,
        fetchPayments,
        getGatewayId,
        getHelpText,
        getPayment,
        getPayments,
        isHostedPayment,
        setPayments
    };

    function configurePayment(providerId, config = {}) {
        const provider = service.getPayment(providerId);

        if (providerId === PAYMENT_PROVIDER.BRAINTREE_PAYPAL) {
            return $q.when(braintreePaypalService.setupSdk(provider.clientToken, config));
        }

        return $q.when();
    }

    function fetchPayments() {
        return $http.get(API.PAYMENTS_URL)
            .then(resp => {
                const data = resp.data.data;

                data.paymentMethods = sortPaymentMethods(data.paymentMethods);

                return service.setPayments(data.paymentMethods);
            });
    }

    function sortPaymentMethods(paymentMethods) {
        const paymentSortOrder = [
            PAYMENT_TYPE.API,
            PAYMENT_TYPE.HOSTED,
            PAYMENT_TYPE.OFFLINE,
        ];

        return _.sortBy(paymentMethods,
            payment => paymentSortOrder.indexOf(payment.type));
    }

    function getHelpText(providerId) {
        const config = service.getPayment(providerId).config || {};

        return config.helpText;
    }

    function getGatewayId(providerId) {
        const payment = service.getPayment(providerId);

        if (!payment) {
            return;
        }

        return payment.gateway;
    }

    function getPayment(providerId) {
        return _.find(payments, { id: providerId });
    }

    function getPayments(predicate) {
        if (predicate) {
            return _.filter(payments, predicate);
        }

        return payments;
    }

    function isHostedPayment(providerId) {
        const provider = service.getPayment(providerId);

        if (!provider) {
            return false;
        }

        return provider.type === PAYMENT_TYPE.HOSTED;
    }

    function setPayments(paymentsToSet) {
        payments.length = 0;
        payments.push.apply(payments, paymentsToSet);

        return payments;
    }

    return service;
}
