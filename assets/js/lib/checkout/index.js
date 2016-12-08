import angular from 'angular';
import 'angular-load';
import { ADDRESS_FIELDS, ADDRESS_REQUIRED_FIELDS, ADDRESS_TYPES } from './constants/address';
import { API } from './constants/api';
import { BC_APP_CONFIG } from './constants/config';
import { BRAINTREE_PAYPAL, PAYMENT_PROVIDER } from './constants/payment-method';
import { API_ERRORS } from './constants/error';
import { PAYMENT_METHOD_TYPE, PAYMENT_SOURCE, PAYMENT_STATUS, PAYMENT_TYPE } from './constants/payment';
import { REMOTE_METHOD } from './constants/checkout-method';
import { BC_SEED_DATA } from './constants/seed-data';
import buildCheckout from './checkout';
import buildAddressService from './services/address-service';
import buildAddressValidationService from './services/address-validation-service';
import buildApiErrorsService from './services/api-error-service';
import buildBigpayClientService from './services/bigpay-client-service';
import buildBigpayPaymentService from './services/bigpay-payment-service';
import buildBraintreePaypalService from './services/payment-methods/braintree-paypal-service';
import buildCartService from './services/cart-service';
import buildConfigService from './services/config-service';
import buildCountryService from './services/country-service';
import buildCurrencyService from './services/currency-service';
import buildCustomErrorConstructors from './services/custom-error-service';
import buildCustomerService from './services/customer-service';
import buildOrderService from './services/order-service';
import buildPaymentMethodService from './services/payment-method-service';
import buildPaymentService from './services/payment-service';
import buildQuoteService from './services/quote-service';
import buildRedeemableService from './services/redeemable-service';
import buildShippingMethodService from './services/shipping-method-service';
import buildStateService from './services/state-service';
import buildValidationService from './services/validation-service';

const module = angular.module('bigcommerce-checkout', [
    'angularLoad',
])
    .constant('ADDRESS_FIELDS', ADDRESS_FIELDS)
    .constant('ADDRESS_REQUIRED_FIELDS', ADDRESS_REQUIRED_FIELDS)
    .constant('ADDRESS_TYPES', ADDRESS_TYPES)
    .constant('API', API)
    .constant('API_ERRORS', API_ERRORS)
    .constant('BC_APP_CONFIG', BC_APP_CONFIG)
    .constant('BC_SEED_DATA', BC_SEED_DATA)
    .constant('BRAINTREE_PAYPAL', BRAINTREE_PAYPAL)
    .constant('PAYMENT_METHOD_TYPE', PAYMENT_METHOD_TYPE)
    .constant('PAYMENT_PROVIDER', PAYMENT_PROVIDER)
    .constant('PAYMENT_SOURCE', PAYMENT_SOURCE)
    .constant('PAYMENT_STATUS', PAYMENT_STATUS)
    .constant('PAYMENT_TYPE', PAYMENT_TYPE)
    .constant('REMOTE_METHOD', REMOTE_METHOD)
    .factory('checkout', buildCheckout)
    .factory('addressService', buildAddressService)
    .factory('addressValidationService', buildAddressValidationService)
    .factory('apiErrorsService', buildApiErrorsService)
    .factory('bigpayClientService', buildBigpayClientService)
    .factory('bigpayPaymentService', buildBigpayPaymentService)
    .factory('braintreePaypalService', buildBraintreePaypalService)
    .factory('cartService', buildCartService)
    .factory('configService', buildConfigService)
    .factory('countryService', buildCountryService)
    .factory('currencyService', buildCurrencyService)
    .factory('ERRORS', buildCustomErrorConstructors)
    .factory('customerService', buildCustomerService)
    .factory('orderService', buildOrderService)
    .factory('paymentMethodService', buildPaymentMethodService)
    .factory('paymentService', buildPaymentService)
    .factory('quoteService', buildQuoteService)
    .factory('redeemableService', buildRedeemableService)
    .factory('shippingMethodService', buildShippingMethodService)
    .factory('stateService', buildStateService)
    .factory('validationService', buildValidationService);

export function createCheckout() {
    const injector = angular.injector([
        'ng',
        module.name,
    ]);

    return injector.get('checkout');
}
