export default function buildBraintreePaypalService(
    $q,
    $window,
    angularLoad,
    BRAINTREE_PAYPAL,
    cartService,
    configService,
    currencyService,
    customerService
) {
    'ngInject';

    const service = {
        initializeCheckout,
        setupSdk,
        teardownSdk,
    };

    let checkoutFlow;
    let integration;

    /**
     * Initialise PayPal checkout flow
     * @returns {Promise}
     */
    function initializeCheckout() {
        if (!integration) {
            throw new Error('You must setup Braintree SDK before calling this method');
        }

        checkoutFlow = $q.defer();

        integration.paypal.initAuthFlow();

        return checkoutFlow.promise;
    }

    /**
     * Setup Braintree SDK
     * @param {string} clientToken
     * @param {Object} [config={}]
     * @returns {Promise}
     */
    function setupSdk(clientToken, config = {}) {
        return loadScript()
            .then(braintreeSdk => {
                return $q(resolve => {
                    config = getPayPalConfig(config);

                    if (!document.getElementById(config.container)) {
                        const containerElement = document.createElement('div');

                        containerElement.id = config.container;

                        document.body.appendChild(containerElement);
                    }

                    braintreeSdk.setup(clientToken, BRAINTREE_PAYPAL.INTEGRATION_TYPE.CUSTOM, {
                        onPaymentMethodReceived: handleSuccess,
                        onReady: resp => {
                            integration = resp;

                            resolve(braintreeSdk);
                        },
                        paypal: config,
                    });
                });
            });
    }

    /**
     * Teardown Braintree SDK
     * @returns {void}
     */
    function teardownSdk() {
        if (!integration) {
            return;
        }

        integration.teardown(() => integration = null);
    }

    /**
     * Get PayPal setup config
     * @private
     * @param {Object} config
     * @param {string} config.container
     * @returns {Object}
     */
    function getPayPalConfig({ container = BRAINTREE_PAYPAL.CONTAINER_ID }) {
        const amount = cartService.getPaidTotal(isUsingStoreCredit);
        const currency = currencyService.getCurrencyCode();
        const isUsingStoreCredit = customerService.getUsingStoreCredit();
        const locale = configService.getStoreLanguage();

        return {
            amount,
            currency,
            locale,
            container,
            enableShippingAddress: true,
            headless: true,
            onAuthorizationDismissed: handleError,
            onCancelled: handleError,
            onUnsupported: handleError,
            singleUse: true,
        };
    }

    /**
     * Error handler
     * @private
     * @param {Object} response
     * @returns {void}
     */
    function handleError(response) {
        if (!checkoutFlow) {
            return;
        }

        checkoutFlow.reject(response);
        checkoutFlow = null;
    }

    /**
     * Success handler
     * @private
     * @param {Object} response
     * @returns {void}
     */
    function handleSuccess(response) {
        if (!checkoutFlow) {
            return;
        }

        checkoutFlow.resolve(response);
        checkoutFlow = null;
    }

    /**
     * Load Braintree SDK script
     * @private
     * @returns {Promise}
     */
    function loadScript() {
        if ($window.braintree) {
            return $q.when($window.braintree);
        }

        return angularLoad.loadScript(BRAINTREE_PAYPAL.SDK_URL)
            .then(() => $window.braintree);
    }

    return service;
}
