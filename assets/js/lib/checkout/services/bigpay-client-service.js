import { createClient } from 'bigpay-client';

export default function buildBigpayClientService(
    $window,
    configService
) {
    'ngInject';

    const host = configService.getBigpayBaseUrl();

    return createClient({ host });
}
