export default function buildRedeemableService(
    $http,
    API,
    cartService
) {
    'ngInject';

    const service = {
        applyRedeemable,
        getCoupons,
        getGiftCertificates,
        removeRedeemable,
    };

    function applyRedeemable(redeemableCode) {
        return $http.post(API.COUPON_URL, { couponCode: redeemableCode })
                .then(resp => resp.data.data.cart);
    }

    function getCoupons() {
        return cartService.getCart().coupon.coupons;
    }

    function getGiftCertificates() {
        return cartService.getCart().giftCertificate.appliedGiftCertificates;
    }

    function removeRedeemable(redeemableCode) {
        return $http.delete(API.COUPON_URL +  '/' + redeemableCode)
                .then(resp => resp.data.data.cart);
    }

    return service;
}
