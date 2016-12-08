export const API_ERRORS = {
    'FATAL': [
        'catalog_only',
        'empty_cart',
        'invalid_order_id',
        'invalid_order_token',
        'missing_order_token',
        'invalid_payment_provider',
        'missing_provider_token',
        'missing_shipping_method',
        'order_completion_error',
        'order_create_failed',
        'provider_setup_error',
        'stock_too_low',
    ],
    'FATAL.THIRD_PARTY': [
        'order_status_error',
        'provider_fatal_error',
    ],
    'RECOVERABLE': [
        'unsupported_provider_country',
    ],
    'RECOVERABLE.THIRD_PARTY': [
        'payment_invalid',
        'provider_error',
        'provider_widget_error',
        'user_payment_error',
    ],
};
