function buildBigpayClientService(
    $window,
    configService
) {
    const host = configService.getBigpayBaseUrl();

    return $window.bigpayClient.createClient({ host });
}

angular.module('bigcommerce-checkout')
    .factory('bigpayClientService', buildBigpayClientService);
