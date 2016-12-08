const ADDRESS_FIELDS = [
    'addressLine1',
    'addressLine2',
    'city',
    'company',
    'country',
    'countryCode',
    'firstName',
    'lastName',
    'phone',
    'postCode',
    'province',
    'provinceCode',
    'type',
];

const ADDRESS_REQUIRED_FIELDS = [
    'addressLine1',
    'city',
    'country',
    'countryCode',
    'firstName',
    'lastName',
    'phone',
    'postCode',
];

const ADDRESS_TYPES = {
    BILLING: 'billing',
    SHIPPING: 'shipping',
};

angular.module('bigcommerce-checkout')
    .constant('ADDRESS_FIELDS', ADDRESS_FIELDS)
    .constant('ADDRESS_REQUIRED_FIELDS', ADDRESS_REQUIRED_FIELDS)
    .constant('ADDRESS_TYPES', ADDRESS_TYPES);
