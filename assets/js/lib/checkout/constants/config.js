const BC_APP_CONFIG = {
    "bigpayBaseUrl": "https:\/\/bigpay.integration.zone",
    "cartLink": "https:\/\/store-to68wp87.bcapp.dev\/cart.php",
    "cdnPath": "https:\/\/cdn1-d.bcapp.dev\/r-head",
    "checkout": {
        "enableOrderComments": 1,
        "enableTermsAndConditions": 0,
        "guestCheckoutEnabled": 1,
        "orderTermsAndConditions": "",
        "orderTermsAndConditionsLink": "",
        "orderTermsAndConditionsType": "",
        "shippingQuoteFailedMessage": "Unfortunately one or more items in your cart can't be shipped to your location. Please choose a different delivery address.",
        "realtimeShippingProviders": ["Fedex", "UPS", "USPS"],
        "remoteCheckoutProviders": []
    },
    "clientSidePaymentProviders": ["braintree", "paypal", "usaepay", "nmi"],
    "currency": {
        "code": "USD",
        "decimal_places": "2",
        "decimal_separator": ".",
        "symbol_location": "left",
        "symbol": "$",
        "thousands_separator": ","
    },
    "shopperCurrency": {
        "code": "USD",
        "symbol_location": "left",
        "symbol": "$",
        "decimal_places": "2",
        "decimal_separator": ".",
        "thousands_separator": ",",
        "exchange_rate": "1.0000000000"
    },
    "defaultNewsletterSignup": false,
    "imageDirectory": "product_images",
    "passwordRequirements": {
        "alpha": "\/[A-Za-z]\/",
        "numeric": "\/[0-9]\/",
        "minlength": 7,
        "error": "Passwords must be at least 7 characters and contain both alphabetic and numeric characters."
    },
    "orderEmail": "info@s1480381571.bcapp.dev",
    "shopPath": "https:\/\/store-to68wp87.bcapp.dev",
    "showNewsletterSignup": true,
    "storeHash": "to68wp87",
    "storeId": "1480381571",
    "storeName": "s1480381571",
    "storePhoneNumber": "",
    "storeLanguage": "en_US"
};

angular.module('bigcommerce-checkout')
    .constant('BC_APP_CONFIG', BC_APP_CONFIG);
