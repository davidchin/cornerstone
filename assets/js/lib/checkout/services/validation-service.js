export default function buildValidationService() {
    'ngInject';

    const service = {
        isRequiredFieldValid,
    };

    function isRequiredFieldValid(data, fieldName) {
        const value = data ? data[fieldName] : null;

        return !_.isEmpty(value);
    }

    return service;
}
