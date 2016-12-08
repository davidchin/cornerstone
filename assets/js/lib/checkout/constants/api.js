export const API = {
    ACCOUNT_URL: '/internalapi/v1/checkout/customer',
    BILLING_URL: '/internalapi/v1/checkout/billing?includes=cart,quote',
    CART_URL: '/internalapi/v1/checkout/cart',
    COUPON_URL: '/internalapi/v1/checkout/coupon',
    CUSTOMER_URL: '/internalapi/v1/checkout/customer?includes=cart,quote,shippingOptions',
    ORDER_URL: '/internalapi/v1/checkout/order',
    PAYMENTS_URL: '/internalapi/v1/checkout/payments',
    QUOTE_DEBUG_URL: '/internalapi/v1/checkout/quote',
    QUOTE_URL: '/internalapi/v1/checkout/quote?includes=cart,customer,shippingOptions,order',
    SHIPPING_URL: '/internalapi/v1/checkout/shipping?includes=cart,quote,shippingOptions',
    SHIPPING_OPTIONS_URL: '/internalapi/v1/checkout/shippingoptions?includes=cart,quote',
};
