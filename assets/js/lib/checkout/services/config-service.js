export default function buildConfigService(
    BC_APP_CONFIG
) {
    'ngInject';

    const service = {
        getBigpayBaseUrl,
        getCartUrl,
        getClientSidePaymentProviders,
        getDefaultNewsLetterSignup,
        getOrderEmail,
        getRemoteCheckoutProviders,
        getShippingOptionsFailedMessage,
        getShowNewsletterSignup,
        getStore,
        getStoreHash,
        getStoreId,
        getStoreLanguage,
        getStoreName,
        getStorePhoneNumber,
        getTermsAndConditions,
        getTermsAndConditionsUrl,
        isGuestCheckoutEnabled,
        isOrderCommentsEnabled,
        isTermsAndConditionsEnabled,
        isTermsAndConditionsLink,
    };

    function getBigpayBaseUrl() {
        return BC_APP_CONFIG.bigpayBaseUrl;
    }

    function getCartUrl() {
        return BC_APP_CONFIG.cartLink;
    }

    function getClientSidePaymentProviders() {
        return BC_APP_CONFIG.clientSidePaymentProviders;
    }

    function getDefaultNewsLetterSignup() {
        return BC_APP_CONFIG.defaultNewsletterSignup;
    }

    function getOrderEmail() {
        return BC_APP_CONFIG.orderEmail;
    }

    function getRemoteCheckoutProviders() {
        return BC_APP_CONFIG.checkout.remoteCheckoutProviders;
    }

    function getShippingOptionsFailedMessage() {
        return BC_APP_CONFIG.checkout.shippingQuoteFailedMessage;
    }

    function getShowNewsletterSignup() {
        return BC_APP_CONFIG.showNewsletterSignup;
    }

    function getStore() {
        return {
            storeHash: service.getStoreHash(),
            storeId: service.getStoreId(),
            storeLanguage: service.getStoreLanguage(),
            storeName: service.getStoreName(),
        };
    }

    function getStoreHash() {
        return BC_APP_CONFIG.storeHash;
    }

    function getStoreId() {
        return BC_APP_CONFIG.storeId;
    }

    function getStoreLanguage() {
        return BC_APP_CONFIG.storeLanguage;
    }

    function getStoreName() {
        return BC_APP_CONFIG.storeName;
    }

    function getStorePhoneNumber() {
        return BC_APP_CONFIG.storePhoneNumber;
    }

    function getTermsAndConditions() {
        return BC_APP_CONFIG.checkout.orderTermsAndConditions;
    }

    function getTermsAndConditionsUrl() {
        return BC_APP_CONFIG.checkout.orderTermsAndConditionsLink;
    }

    function isGuestCheckoutEnabled() {
        return BC_APP_CONFIG.checkout.guestCheckoutEnabled === 1;
    }

    function isOrderCommentsEnabled() {
        return BC_APP_CONFIG.checkout.enableOrderComments === 1;
    }

    function isTermsAndConditionsEnabled() {
        return BC_APP_CONFIG.checkout.enableTermsAndConditions === 1;
    }

    function isTermsAndConditionsLink() {
        return BC_APP_CONFIG.checkout.orderTermsAndConditionsType === 'link';
    }

    return service;
}
