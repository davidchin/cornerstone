export default function buildCurrencyService(
    BC_APP_CONFIG
) {
    'ngInject';

    const service = {
        getCurrency,
        getCurrencyCode,
    };

    function getCurrency(key) {
        return key ? BC_APP_CONFIG.currency[key] : BC_APP_CONFIG.currency;
    }

    function getCurrencyCode() {
        return service.getCurrency('code');
    }

    return service;
}
