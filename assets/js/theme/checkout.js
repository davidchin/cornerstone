import { createCheckout } from '../lib/checkout';
import CheckoutView from './checkout/view';
import PageManager from '../page-manager';

export default class CheckoutPage extends PageManager {
    constructor() {
        super();

        this.checkout = createCheckout();
        this.view = new CheckoutView();

        this.view.onLogin = this.handleLogin.bind(this);
        this.view.onShippingAddress = this.handleShippingAddress.bind(this);
        this.view.onBillingAddress = this.handleBillingAddress.bind(this);
        this.view.onShippingMethodChange = this.handleShippingMethodChange.bind(this);
        this.view.onContinueAsGuest = this.handleContinueAsGuest.bind(this);
        this.view.onSubmitOrder = this.handleSubmitOrder.bind(this);
        this.view.onPaymentMethodChange = this.handlePaymentMethodChange.bind(this);
        this.view.onGuestCheckout = this.handleGuestCheckout.bind(this);

        this.init();
    }

    init() {
        this.view.spin('login');
        this.checkout.initialize()
            .then(data => {
                data.status.hasCustomer ? this.view.setCustomer(data.customer) : '';
                data.status.hasShippingAddress ? this.view.setShippingAddress(data.shippingAddress) : '';
                data.shippingMethods && data.shippingMethods.length ? this.view.setShippingMethod(data.shippingMethods) : '';
                data.status.hasBillingAddress ? this.view.setBillingAddress(data.billingAddress) : '';
                data.paymentMethods && data.paymentMethods.length ? this.view.setPaymentMethods(data.paymentMethods) : '';
                this.view.spin('login');
            });
    }

    handleLogin(credentials) {
        this.view.spin('login');
        this.checkout.loginCustomer(credentials)
            .then(customer => {
                this.view.spin('login');
                this.view.setCustomer(customer);
                this.view.setShippingAddress(this.checkout.getShippingAddress());
                this.view.setShippingMethod(this.checkout.getShippingMethods());
                this.view.setBillingAddress(this.checkout.getBillingAddress());
                this.view.spin('paymentMethod');
                return this.checkout.fetchPaymentMethods();
            })
            .then(payments => {
                this.view.setPaymentMethods(payments);
                this.view.spin('paymentMethod');
            })
            .catch(error => {
                this.view.showError(error);
            });
    }

    handleGuestCheckout(email) {
        this.view.spin('email');
        return this.checkout.continueAsGuest(email)
            .then(customer => this.view.setCustomer(customer))
            .then(() => this.view.spin('email'));
    }

    handleShippingAddress(data) {
        this.view.spin('shipping');
        return this.checkout.submitShippingAddress(data)
            .then(address => this.view.setShippingAddress(address))
            .then(() => this.checkout.getShippingMethods())
            .then(methods => this.view.setShippingMethod(methods))
            .then(() => this.view.spin('shipping'));
    }

    handleBillingAddress(data) {
        this.view.spin('billing');
        return this.checkout.submitBillingAddress(data)
            .then(address => this.view.setBillingAddress(address))
            .then(() => this.checkout.fetchPaymentMethods())
            .then(methods => {
                this.checkout.selectPaymentMethod(methods[0].id);
                this.view.setPaymentMethods(methods);
            })
            .then(() => this.view.spin('billing'));
    }

    handleShippingMethodChange(method) {
        this.view.spin('shippingMethod');
        return this.checkout.selectShippingMethod(method)
            .then(() => this.view.spin('shippingMethod'));
    }

    handleContinueAsGuest() {
        this.view.showGuestForm();
    }

    handlePaymentMethodChange(methodId) {
        this.view.spin('paymentMethod');

        return this.checkout.selectPaymentMethod(methodId)
            .then(method => {
                this.checkout.configurePaymentMethod();

                if (method.id !== 'braintreepaypal') {
                    this.view.showCardForm();
                } else {
                    this.view.hideCardForm();
                }

                this.enablePay();
                this.view.spin('paymentMethod')
            });
    }

    enablePay() {
        this.view.enablePay(this.checkout.getCart().grandTotal.amount);
    }

    handleSubmitOrder(data) {
        this.view.spin('pay');
        this.checkout.submitOrder(data)
            .then(() => this.view.thankyou());
    }
}
