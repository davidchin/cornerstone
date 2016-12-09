export default class CheckoutView {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        this.section = {
            login: document.body.querySelector('.login'),
            email: document.body.querySelector('.email'),
            shipping: document.body.querySelector('.shipping'),
            shippingMethod: document.body.querySelector('.shippingMethod'),
            billing: document.body.querySelector('.billing'),
            paymentMethod: document.body.querySelector('.paymentMethod'),
            payment: document.body.querySelector('.payment'),
            pay: document.body.querySelector('.pay'),
            thankyou: document.body.querySelector('.thankyou'),
        };

        this.loginForm = document.body.querySelector('.login form');
        this.emailForm = document.body.querySelector('.email form');
        this.paymentForm = document.body.querySelector('.payments form');
        this.guestCheckoutForm = document.body.querySelector('.email form');
        this.shippingAddressForm = document.body.querySelector('.shipping form');
        this.billingAddressForm = document.body.querySelector('.billing form');

        this.continueAsGuest = document.body.querySelector('.guest');
        this.submitOrder = this.section.pay.querySelector('input');

        this.loginForm.addEventListener('submit', (event) => {
            const data = new FormData(event.target);

            event.preventDefault();

            this.onLogin({
                email: data.get('username'),
                password: data.get('password'),
            });
        });

        this.guestCheckoutForm.addEventListener('submit', event => {
            const data = new FormData(this.emailForm);
            event.preventDefault();
            this.onGuestCheckout(data.get('email'));
        });

        this.shippingAddressForm.addEventListener('submit', event => {
            const data = new FormData(this.shippingAddressForm);
            event.preventDefault();
            this.onShippingAddress(this.formDataToObject(data));
        });

        this.billingAddressForm.addEventListener('submit', event => {
            const data = new FormData(this.billingAddressForm);
            event.preventDefault();
            this.onBillingAddress(this.formDataToObject(data));
        });

        this.section.shippingMethod.querySelector('.methods').addEventListener('change', event => {
            this.onShippingMethodChange(event.target.selectedOptions[0].value);
        });

        this.section.paymentMethod.querySelector('.methods').addEventListener('change', event => {
            this.onPaymentMethodChange(event.target.selectedOptions[0].value);
        });

        this.continueAsGuest.addEventListener('click', event => {
            this.onContinueAsGuest();
        });

        this.submitOrder.addEventListener('click', event => {
            const data = new FormData(this.section.payment.querySelector('form'));
            event.preventDefault();
            this.onSubmitOrder(this.formDataToObject(data));
        });
    }

    spin(section) {
        this.section[section].classList.toggle('spinner');
    }

    formDataToObject(data) {
        let output = {};

        data.forEach((val, key) => {
            if (~key.indexOf('.')) {
                key = key.split('.');
                output[key[0]] = output[key[0]] || {};
                output[key[0]][key[1]] = val;
            } else {
                output[key] = val;
            }
        });

        console.log(output);
        return output;
    }

    showGuestForm() {
        this.section.login.classList.remove('visible');
        this.section.email.classList.add('visible');
    }

    compileCart() {
        const templateHtml = $('#cartTemplate').html();
        const templateFn = Handlebars.compile(templateHtml);

        return templateFn(this.data);
    }

    setCustomer(customer) {
        const email = this.emailForm.querySelector('.emailAddress');

        this.hide('login');
        this.show('email');
        this.show('shipping');

        email.value = customer.email;
        email.disabled = true;
        this.emailForm.classList.add('completed');
    }

    setBillingAddress(address) {
        this.show('billing');
        this.show('paymentMethod');
        this.fillForm(this.billingAddressForm, address, true);
    }

    fillForm(form, data, completed) {
        Object.keys(data).forEach(key => {
            let elem = form.querySelector(`[name=${key}]`);

            if (elem) {
                elem.value = data[key];
                elem.disabled = !!completed;
            }

        });

        if (completed) {
            form.classList.add('completed');
        }
    }

    setPaymentMethods(methods) {
        const data = methods.map(method => {
            if (method.id === 'braintreepaypal') {
                method.config.displayName = 'Paypal by Braintree';
            }

            return `<option value="${method.id}">${method.config.displayName}</option>`;
        });

        console.log('paymentmethod set');

        this.show('billing');
        this.show('paymentMethod');
        this.show('pay');
        this.section.paymentMethod.querySelector('.methods').innerHTML = data.join('');
        this.onPaymentMethodChange(methods[0].id);
    }

    hide(section) {
        this.section[section].classList.remove('visible');
    }

    show(section) {
        this.section[section].classList.add('visible');
    }

    setShippingAddress(address) {
        this.shippingForm = document.body.querySelector('.shipping form');
        this.fillForm(this.shippingForm, address, true);
        this.show('shipping');
        this.show('shippingMethod');
    }

    setShippingMethod(methods) {
        const data = methods.map(method => {
            const selected = method.selected ? 'selected="selected"' : '';
            return `<option value="${method.id}" ${selected}>${method.description} (${method.formattedPrice})</option>`;
        });

        this.show('shippingMethod');
        this.show('billing');
        this.show('paymentMethod');
        this.section.shippingMethod.querySelector('.methods').innerHTML = data.join('');
    }

    enablePay(value) {
        this.submitOrder.disabled = false;
        this.submitOrder.value = `Pay $${value}`;
    }

    showCardForm() {
        this.section.payment.classList.remove('hide');
        this.show('payment');
    }

    hideCardForm() {
        this.section.payment.classList.add('hide');
    }

    showError(error) {
        throw error;
    }

    thankyou() {
        Object.keys(this.section).forEach(key => this.section[key].classList.add('hide'));
        this.show('thankyou');
    }
}
