import { createCheckout } from '../lib/checkout';
import PageManager from '../page-manager';

export default class CheckoutPage extends PageManager {
    constructor() {
        super();

        this.checkout = createCheckout();
    }

    loaded(next) {
        this.checkout.initialize()
            .then(() => this.checkout.continueAsGuest('david.chin+test@bigcommerce.com'))

            .then(() => console.log('Customer is submitted'))

            .then(() => this.checkout.submitBillingAddress({
                addressLine1: "1-3 Smail St",
                addressLine2: "Ultimo",
                city: "Sydney",
                company: null,
                country: "Australia",
                countryCode: "AU",
                firstName: "David",
                lastName: "Chin",
                phone: "0400000000",
                postCode: "2007",
                province: "New South Wales",
                provinceCode: "NSW",
                type: "residential",
            }))

            .then(() => console.log('Billing address is submitted'))

            .then(() => this.checkout.submitShippingAddress({
                addressLine1: "1-3 Smail St",
                addressLine2: "Ultimo",
                city: "Sydney",
                company: null,
                country: "Australia",
                countryCode: "AU",
                firstName: "David",
                lastName: "Chin",
                phone: "0400000000",
                postCode: "2007",
                province: "New South Wales",
                provinceCode: "NSW",
                type: "residential",
            }))
            .then(() => console.log('Shipping address is submitted'))

            .then(() => this.checkout.selectShippingMethod(this.checkout.getShippingMethods()[0].id))

            .then(() => console.log('Shipping method is selected'))

            .then(() => this.checkout.fetchPaymentMethods())

            /*
            .then(() => this.checkout.selectPaymentMethod('testgateway'))
            */
            .then(() => this.checkout.selectPaymentMethod('braintreepaypal'))

            .then(() => console.log('Payment method is selected'))

            .then(() => this.checkout.configurePaymentMethod())

            .then(() => this.checkout.submitOrder())
            /*
            .then(() => this.checkout.submitOrder({
                ccNumber: '4111111111111111',
                ccCvv: '737',
                ccName: 'BigCommerce',
                ccExpiry: {
                    month: '12',
                    year: '18',
                },
                ccType: 'visa',
            }))
            */

            .then(() => console.log('Order is submitted'))

            .then(() => {
                console.log(this.checkout.getData());

                alert('Done!');

                location.href = '/';
            })

            .catch(err => {
                console.error(err);

                alert('Error!');
            });

        next();
    }
}
