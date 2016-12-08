export default function buildAddressValidationService(
    ADDRESS_FIELDS,
    ADDRESS_REQUIRED_FIELDS,
    stateService,
    validationService
) {
    'ngInject';

    const service = {
        isFieldRequired,
        isFieldValid,
        isValid,
    };

    function isFieldRequired(address, fieldName) {
        if (fieldName === 'province' || fieldName === 'provinceCode') {
            return address ? stateService.hasStates(address.countryCode) : false;
        }

        return _.contains(ADDRESS_REQUIRED_FIELDS, fieldName);
    }

    function isFieldValid(address, fieldName) {
        if (service.isFieldRequired(address, fieldName) && !validationService.isRequiredFieldValid(address, fieldName)) {
            return false;
        }

        return true;
    }

    function isValid(address) {
        return _.every(ADDRESS_FIELDS, fieldName => {
            return service.isFieldValid(address, fieldName)
        });
    }

    return service;
}
