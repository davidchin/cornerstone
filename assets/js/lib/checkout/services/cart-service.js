export default function buildCartService(
    $http,
    $q,
    API,
    ERRORS
) {
    'ngInject';

    const cart = {};
    const service = {
        fetchCart,
        getCart,
        getGrandTotal,
        getItemsCount,
        getPaidTotal,
        getStoreCredit,
        getUsableStoreCredit,
        isShippingRequired,
        setCart,
        setStoreCredit,
        verifyCart,
        verifyCartSame,
    };
    let credit = 0;

    function clearCart(cart) {
        _.each(_.keys(cart), key => delete cart[key]);

        return cart;
    }

    function fetchCart() {
        return $http.get(API.CART_URL)
            .then(resp => resp.data.data.cart)
            .then(service.setCart);
    }

    function getCart() {
        return cart;
    }

    function getGrandTotal() {
        if (!cart || !cart.grandTotal) {
            return;
        }

        return cart.grandTotal.amount;
    }

    function getItemsCount() {
        return _.reduce(cart.items, (sum, item) => {
            return sum + item.quantity;
        }, 0);
    }

    function getPaidTotal(useCredit = true) {
        let grandTotal = service.getGrandTotal();
        let usableStoreCredit = service.getUsableStoreCredit();

        if (grandTotal > 0) {
            grandTotal -= useCredit ? usableStoreCredit : 0;
        }

        return grandTotal;
    }

    function getStoreCredit() {
        return credit;
    }

    function getUsableStoreCredit() {
        return Math.min(service.getGrandTotal(), service.getStoreCredit());
    }

    function isShippingRequired() {
        if (cart.shipping && cart.shipping.required === false) {
            return false;
        }

        return true;
    }

    function setCart(cartToSet = {}) {
        return _.extend(clearCart(cart), cartToSet);
    }

    function setStoreCredit(creditToSet = 0) {
        credit = creditToSet;

        return credit;
    }

    function verifyCart() {
        const cartCopy = _.cloneDeep(cart);

        return service.fetchCart()
            .then(cart => service.verifyCartSame(cartCopy, cart));
    }

    function verifyCartSame(cartCopy, cart) {
        const stableCart = _excludeUnstableProps(cart);
        const stableCartCopy = _excludeUnstableProps(cartCopy);

        if (angular.equals(stableCartCopy, stableCart)) {
            return $q.when(cart);
        }

        return $q.reject(new ERRORS.CART_CHANGED());
    }

    /* private helpers */
    function _excludeUnstableProps(cart) {
        const cartClone = _.cloneDeep(cart);
        const unstableProps = ['imageUrl'];

        cartClone.items = _.map(cartClone.items, (item) => {
            _.each(unstableProps, (prop) => {
                delete item[prop];
            });

            return item;
        });

        return cartClone;
    }

    return service;
}
