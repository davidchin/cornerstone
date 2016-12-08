const PAYMENT_TYPE = {
    API: 'PAYMENT_TYPE_API',
    HOSTED: 'PAYMENT_TYPE_HOSTED',
    OFFLINE: 'PAYMENT_TYPE_OFFLINE',
};

const PAYMENT_METHOD_TYPE = {
    CREDIT_CARD: 'credit-card',
    MULTI_OPTION: 'multi-option',
    PAYPAL: 'paypal',
    TEST_GATEWAY: 'zzzblackhole',
    WIDGET: 'widget',
};

const PAYMENT_SOURCE = 'bcapp-checkout-uco';

const PAYMENT_STATUS = {
    ACKNOWLEDGE: 'PAYMENT_STATUS_ACKNOWLEDGE',
    FINALIZE: 'PAYMENT_STATUS_FINALIZE',
    INITIALIZE: 'PAYMENT_STATUS_INITIALIZE',
};

angular.module('bigcommerce-checkout')
    .constant('PAYMENT_METHOD_TYPE', PAYMENT_METHOD_TYPE)
    .constant('PAYMENT_SOURCE', PAYMENT_SOURCE)
    .constant('PAYMENT_STATUS', PAYMENT_STATUS)
    .constant('PAYMENT_TYPE', PAYMENT_TYPE);
