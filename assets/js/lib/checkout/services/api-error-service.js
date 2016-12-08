export default function buildApiErrorsService(
    API_ERRORS
) {
    'ngInject';

    const service = {
        isFatalError,
        isFatalThirdPartyError,
        isRecoverableError,
        isRecoverableThirdPartyError,
    };

    function isFatalError(errorType) {
        return _.contains(API_ERRORS['FATAL'], errorType);
    }

    function isFatalThirdPartyError(errorType) {
        return _.contains(API_ERRORS['FATAL.THIRD_PARTY'], errorType);
    }

    function isRecoverableError(errorType) {
        return _.contains(API_ERRORS['RECOVERABLE'], errorType);
    }

    function isRecoverableThirdPartyError(errorType) {
        return _.contains(API_ERRORS['RECOVERABLE.THIRD_PARTY'], errorType);
    }

    return service;
}
