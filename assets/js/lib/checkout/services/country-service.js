export default function countryServiceFactory(
    BC_SEED_DATA
) {
    'ngInject';

    const service = {
        getCountries,
        getShippingCountries,
    };

    function getCountries() {
        return BC_SEED_DATA['all-countries'];
    }

    function getShippingCountries() {
        return BC_SEED_DATA['shipping-countries'];
    }

    return service;
}
