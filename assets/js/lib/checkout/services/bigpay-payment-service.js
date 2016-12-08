export default function buildBigpayPaymentService(
    $q,
    addressService,
    bigpayClientService,
    cartService,
    configService,
    customerService,
    ERRORS,
    PAYMENT_PROVIDER,
    PAYMENT_SOURCE,
    paymentMethodService,
    paymentService,
    quoteService
) {
    'ngInject';

    const service = {
        initializeOffsitePayment,
        isEnabledForProvider,
        submitPayment,
    };

    function getPayload(authToken, order, payment) {
        const billingAddress = addressService.getBillingAddress();
        const cart = cartService.getCart();
        const customer = customerService.getCustomer();
        const paymentMethod = paymentService.getPaymentProvider();
        const quoteMeta = quoteService.getQuoteMeta();
        const shippingAddress = addressService.getShippingAddress();
        const source = PAYMENT_SOURCE;
        const store = configService.getStore();

        return {
            authToken,
            billingAddress,
            cart,
            customer,
            order,
            payment,
            paymentMethod,
            quoteMeta: _.merge({}, quoteMeta, { request: { geoCountryCode: 'AU' } }),
            shippingAddress,
            source,
            store,
        };
    }

    function handlePaymentError(resp) {
        const errorMessage = _.map(resp.data.errors, error => error.message).join(' ');

        return $q.reject(new ERRORS.PAYMENT_ERROR(resp.data.errors, errorMessage));
    }

    function isEnabledForProvider(providerId) {
        const providerIds = configService.getClientSidePaymentProviders();
        const gatewayId = paymentMethodService.getGatewayId(providerId);

        return _.contains(providerIds, providerId) ||
               _.contains([PAYMENT_PROVIDER.ADYEN], gatewayId);
    }

    function submitPayment(authToken, order, payment) {
        const deferred = $q.defer();
        const payload = getPayload(authToken, order, payment);

        bigpayClientService.submitPayment(payload, (err, resp) => {
            err ? deferred.reject(err) : deferred.resolve(resp);
        });

        return deferred.promise.catch(handlePaymentError);
    }

    function initializeOffsitePayment(authToken, order, payment) {
        const deferred = $q.defer();
        const payload = getPayload(authToken, order, payment);

        bigpayClientService.initializeOffsitePayment(payload, err => {
            // Do not resolve promise when initializing offsite payment
            if (err) {
                deferred.reject(err);
            }
        });

        return deferred.promise.catch(handlePaymentError);
    }

    return service;
}
