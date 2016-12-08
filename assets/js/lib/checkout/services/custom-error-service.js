function buildCustomErrorService() {
    'ngInject';

    const service = {
        create,
    };

    function create(errorName, defaultError = '') {
        const ErrorClass = function ErrorClass(data = {}, errorMessage = '') {
            this.data = data;
            this.message = errorMessage || defaultError;
            this.name = errorName;
            this.stack = (new Error()).stack;
        };

        ErrorClass.prototype = Object.create(Error.prototype);
        ErrorClass.prototype.constructor = ErrorClass;

        return ErrorClass;
    }

    return service;
}

function createCustomErrorConstructors(
    customErrorService,
    gettextCatalog
) {
    'ngInject';

    const accountCreationFailedMessage = gettextCatalog.getString('An error occurred while creating your account. Please try again.');
    const genericFatalErrorMessage = gettextCatalog.getString('Checkout is temporarily unavailable.  Please try again later.');
    const orderRecoverableErrorMessage = gettextCatalog.getString('There was an error placing your order. Please contact us.');
    const paymentErrorMessage = gettextCatalog.getString('An error occurred while processing your payment. Please try again.');
    const postBillingAddressFailedMessage = gettextCatalog.getString('An error occurred while saving the billing address to your price quote. Please try again.');
    const postShippingAddressFailedMessage = gettextCatalog.getString('An error occurred while saving the shipping address to your price quote. Please try again.');
    const remoteCheckoutConnectionRefused = gettextCatalog.getString('Connection to remote checkout refused, please try later.');
    const remotePaymentMethodErrorMessage = gettextCatalog.getString('There was an error retrieving your remote payment method. Please try again.');
    const remoteSessionErrorMessage = gettextCatalog.getString('Your remote session has expired. Please log in again.');
    const remoteShippingAddressErrorMessage = gettextCatalog.getString('There was an error retrieving your remote shipping address. Please try again.');
    const shippingOptionFailed = gettextCatalog.getString('An error occurred while saving the shipping quote to your order. Please try again.');
    const signInFailedMessage = gettextCatalog.getString('The email or password you entered is not valid.');
    const signInThrottledMessage = gettextCatalog.getString('Due to excessive login attempts, please wait 10 seconds before attempting to log in again.');
    const signOutFailedMessage = gettextCatalog.getString('An error occurred while signing out. Please try again.');

    return {
        ACCOUNT_CREATION_FAILED: customErrorService.create('ACCOUNT_CREATION_FAILED', accountCreationFailedMessage),
        CART_CHANGED: customErrorService.create('CART_CHANGED'),
        FIX_INVALID_ADDRESS: customErrorService.create('FIX_INVALID_ADDRESS'),
        GENERIC_FATAL_ERROR: customErrorService.create('GENERIC_FATAL_ERROR', genericFatalErrorMessage),
        ORDER_FATAL_ERROR: customErrorService.create('ORDER_FATAL_ERROR', genericFatalErrorMessage),
        ORDER_RECOVERABLE_ERROR: customErrorService.create('ORDER_RECOVERABLE_ERROR', orderRecoverableErrorMessage),
        PAYMENT_ERROR: customErrorService.create('PAYMENT_ERROR', paymentErrorMessage),
        POST_BILLING_ADDRESS_FAILED: customErrorService.create('POST_BILLING_ADDRESS_FAILED', postBillingAddressFailedMessage),
        POST_SHIPPING_ADDRESS_FAILED: customErrorService.create('POST_SHIPPING_ADDRESS_FAILED', postShippingAddressFailedMessage),
        REMOTE_CHECKOUT_CONNECTION_REFUSED: customErrorService.create('REMOTE_CHECKOUT_CONNECTION_REFUSED', remoteCheckoutConnectionRefused),
        REMOTE_PAYMENT_METHOD_ERROR: customErrorService.create('REMOTE_PAYMENT_METHOD_ERROR', remotePaymentMethodErrorMessage),
        REMOTE_SESSION_ERROR: customErrorService.create('REMOTE_SESSION_ERROR', remoteSessionErrorMessage),
        REMOTE_SHIPPING_ADDRESS_ERROR: customErrorService.create('REMOTE_SHIPPING_ADDRESS_ERROR', remoteShippingAddressErrorMessage),
        REQUEST_CANCELLED: customErrorService.create('REQUEST_CANCELLED'),
        SHIPPING_OPTION_FAILED: customErrorService.create('SHIPPING_OPTION_FAILED', shippingOptionFailed),
        SIGN_IN_FAILED: customErrorService.create('SIGN_IN_FAILED', signInFailedMessage),
        SIGN_IN_THROTTLED: customErrorService.create('SIGN_IN_THROTTLED', signInThrottledMessage),
        SIGN_OUT_FAILED: customErrorService.create('SIGN_OUT_FAILED', signOutFailedMessage),
    };
}

angular.module('bigcommerce-checkout')
    .factory('customErrorService', buildCustomErrorService);

angular.module('bigcommerce-checkout')
    .factory('ERRORS', createCustomErrorConstructors);
