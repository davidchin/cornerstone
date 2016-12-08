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

export default function buildCustomErrorConstructors() {
    'ngInject';

    const accountCreationFailedMessage = 'An error occurred while creating your account. Please try again.';
    const genericFatalErrorMessage = 'Checkout is temporarily unavailable.  Please try again later.';
    const orderRecoverableErrorMessage = 'There was an error placing your order. Please contact us.';
    const paymentErrorMessage = 'An error occurred while processing your payment. Please try again.';
    const postBillingAddressFailedMessage = 'An error occurred while saving the billing address to your price quote. Please try again.';
    const postShippingAddressFailedMessage = 'An error occurred while saving the shipping address to your price quote. Please try again.';
    const remoteCheckoutConnectionRefused = 'Connection to remote checkout refused, please try later.';
    const remotePaymentMethodErrorMessage = 'There was an error retrieving your remote payment method. Please try again.';
    const remoteSessionErrorMessage = 'Your remote session has expired. Please log in again.';
    const remoteShippingAddressErrorMessage = 'There was an error retrieving your remote shipping address. Please try again.';
    const shippingOptionFailed = 'An error occurred while saving the shipping quote to your order. Please try again.';
    const signInFailedMessage = 'The email or password you entered is not valid.';
    const signInThrottledMessage = 'Due to excessive login attempts, please wait 10 seconds before attempting to log in again.';
    const signOutFailedMessage = 'An error occurred while signing out. Please try again.';

    return {
        ACCOUNT_CREATION_FAILED: create('ACCOUNT_CREATION_FAILED', accountCreationFailedMessage),
        CART_CHANGED: create('CART_CHANGED'),
        FIX_INVALID_ADDRESS: create('FIX_INVALID_ADDRESS'),
        GENERIC_FATAL_ERROR: create('GENERIC_FATAL_ERROR', genericFatalErrorMessage),
        ORDER_FATAL_ERROR: create('ORDER_FATAL_ERROR', genericFatalErrorMessage),
        ORDER_RECOVERABLE_ERROR: create('ORDER_RECOVERABLE_ERROR', orderRecoverableErrorMessage),
        PAYMENT_ERROR: create('PAYMENT_ERROR', paymentErrorMessage),
        POST_BILLING_ADDRESS_FAILED: create('POST_BILLING_ADDRESS_FAILED', postBillingAddressFailedMessage),
        POST_SHIPPING_ADDRESS_FAILED: create('POST_SHIPPING_ADDRESS_FAILED', postShippingAddressFailedMessage),
        REMOTE_CHECKOUT_CONNECTION_REFUSED: create('REMOTE_CHECKOUT_CONNECTION_REFUSED', remoteCheckoutConnectionRefused),
        REMOTE_PAYMENT_METHOD_ERROR: create('REMOTE_PAYMENT_METHOD_ERROR', remotePaymentMethodErrorMessage),
        REMOTE_SESSION_ERROR: create('REMOTE_SESSION_ERROR', remoteSessionErrorMessage),
        REMOTE_SHIPPING_ADDRESS_ERROR: create('REMOTE_SHIPPING_ADDRESS_ERROR', remoteShippingAddressErrorMessage),
        REQUEST_CANCELLED: create('REQUEST_CANCELLED'),
        SHIPPING_OPTION_FAILED: create('SHIPPING_OPTION_FAILED', shippingOptionFailed),
        SIGN_IN_FAILED: create('SIGN_IN_FAILED', signInFailedMessage),
        SIGN_IN_THROTTLED: create('SIGN_IN_THROTTLED', signInThrottledMessage),
        SIGN_OUT_FAILED: create('SIGN_OUT_FAILED', signOutFailedMessage),
    };
}
