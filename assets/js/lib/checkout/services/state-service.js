export default function buildStateService(
    BC_SEED_DATA
) {
    'ngInject';

    const service = {
        getShippingStates,
        getStates,
        hasShippingStates,
        hasStates,
    };

    function getAllStates() {
        return BC_SEED_DATA['all-states'];
    }

    function getAllShippingStates() {
        return BC_SEED_DATA['shipping-states'];
    }

    function hasStates(countryCode) {
        const states = service.getStates(countryCode);

        return !_.isEmpty(states);
    }

    function hasShippingStates(countryCode) {
        const states = service.getShippingStates(countryCode);

        return !_.isEmpty(states);
    }

    function getStates(countryCode) {
        const allStates = getAllStates();

        return allStates[countryCode];
    }

    function getShippingStates(countryCode) {
        const allStates = getAllShippingStates();

        return allStates[countryCode];
    }

    return service;
}
